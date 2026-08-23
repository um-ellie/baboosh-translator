let floatingIcon = null;
let translateBox = null;
let selectedTextGlobal = "";
let audioContext = null;
let activeAudioSource = null;
let activeHtmlAudio = null;
let audioPlaybackToken = 0;
let audioRequestToken = 0;

// Resume the Web Audio context while the user is interacting with the page.
// This keeps automatic pronunciation eligible under modern autoplay policies.
function unlockAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
    }
}

// Play TTS audio by fetching a base64 data URL through the background script.
// This bypasses page CSP/CORS restrictions that would block direct TTS requests.
function playAudio(text, btnElement = null) {
    const requestToken = ++audioRequestToken;
    if (btnElement) btnElement.classList.add('btPlaying');

    const removePlayingClass = () => {
        if (btnElement) btnElement.classList.remove('btPlaying');
    };

    try {
        chrome.runtime.sendMessage({ action: "get_audio", text: text }, (response) => {
            if (requestToken !== audioRequestToken) {
                removePlayingClass();
                return;
            }
            if (response && response.success && Array.isArray(response.audioDataUrls)) {
                playAudioSequence(response.audioDataUrls, removePlayingClass);
            } else {
                console.error("Failed to retrieve audio data URL:", response ? response.error : "No response");
                removePlayingClass();
            }
        });
    } catch (err) {
        console.error("Audio messaging failed (extension context likely invalidated):", err);
        removePlayingClass();
    }
}

function playAudioSequence(audioDataUrls, onFinished) {
    const playbackToken = ++audioPlaybackToken;
    let index = 0;
    const playNext = () => {
        if (playbackToken !== audioPlaybackToken) return;
        if (index >= audioDataUrls.length) {
            onFinished();
            return;
        }
        const audioDataUrl = audioDataUrls[index++];
        if (audioContext && audioContext.state === 'running') {
            playWithAudioContext(audioDataUrl, playNext, () => {
                if (playbackToken === audioPlaybackToken) onFinished();
            });
            return;
        }
        const audio = new Audio(audioDataUrl);
        activeHtmlAudio = audio;
        audio.addEventListener('ended', () => {
            if (playbackToken === audioPlaybackToken) playNext();
        }, { once: true });
        audio.addEventListener('error', () => {
            console.warn("Audio chunk failed to play.");
            if (playbackToken === audioPlaybackToken) onFinished();
        }, { once: true });
        audio.play().catch(err => {
            console.warn("Audio playback rejected by browser:", err);
            if (playbackToken === audioPlaybackToken) onFinished();
        });
    };
    playNext();
}

function playWithAudioContext(audioDataUrl, onEnded, onError) {
    try {
        const binary = atob(audioDataUrl.slice(audioDataUrl.indexOf(',') + 1));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        audioContext.decodeAudioData(bytes.buffer)
            .then(buffer => {
                const source = audioContext.createBufferSource();
                activeAudioSource = source;
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.addEventListener('ended', () => {
                    if (activeAudioSource === source) activeAudioSource = null;
                    onEnded();
                }, { once: true });
                source.start();
            })
            .catch(onError);
    } catch (error) {
        onError(error);
    }
}

document.addEventListener('selectionchange', () => {
    try {
        if (!chrome.runtime || !chrome.runtime.id) return;
    } catch (e) {
        removeAllPopups();
        return;
    }

    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';

    if (!text) {
        if (!translateBox && floatingIcon) {
            floatingIcon.remove();
            floatingIcon = null;
        }
        return;
    }

    // Guard: ensure a range exists before calling getRangeAt()
    if (!selection || selection.rangeCount === 0) {
        return;
    }

    selectedTextGlobal = text;

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    if (rects.length === 0) return;

    const lastRect = rects[rects.length - 1];

    // If the main translation box is already open, don't show the floating icon again
    if (translateBox) return;

    if (!floatingIcon) {
        floatingIcon = document.createElement('img');
        floatingIcon.id = 'baboosh-floating-icon';
        floatingIcon.src = chrome.runtime.getURL('src/assets/icon48.png');
        document.body.appendChild(floatingIcon);

        floatingIcon.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            unlockAudio();
            showTranslationBox(lastRect);
        });
    }

    // --- INTELLIGENT ICON POSITIONING ---
    const iconSize = 36; // Matches the 36px width/height from style.css
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Ideal position: slightly to the right and below the end of the text selection
    let iconLeft = lastRect.right + scrollX + 5;
    let iconTop = lastRect.bottom + scrollY + 5;

    // Boundary Protection: Right edge
    if (iconLeft + iconSize > scrollX + viewportWidth) {
        iconLeft = scrollX + viewportWidth - iconSize - 10;
    }
    // Boundary Protection: Left edge
    if (iconLeft < scrollX) {
        iconLeft = scrollX + 10;
    }
    // Boundary Protection: Bottom edge — flip above the selection
    if (iconTop + iconSize > scrollY + viewportHeight) {
        iconTop = lastRect.top + scrollY - iconSize - 5;
    }
    // Boundary Protection: Top edge
    if (iconTop < scrollY) {
        iconTop = scrollY + 10;
    }

    floatingIcon.style.left = `${iconLeft}px`;
    floatingIcon.style.top = `${iconTop}px`;
});

function showTranslationBox(rect) {
    if (floatingIcon) {
        floatingIcon.remove();
        floatingIcon = null;
    }

    if (!translateBox) {
        // Keep this popup tied to the selection that opened it. Later selections
        // must not change the text played by its Listen button.
        const selectedText = selectedTextGlobal;
        translateBox = document.createElement('div');
        translateBox.id = 'baboosh-main-box';

        // Header
        const header = document.createElement('div');
        header.className = 'baboosh-header';

        const headerTitleWrapper = document.createElement('div');
        headerTitleWrapper.className = 'baboosh-header-title-wrapper';

        const headerIcon = document.createElement('img');
        headerIcon.className = 'baboosh-header-icon';
        headerIcon.src = chrome.runtime.getURL('src/assets/icon48.png');

        const headerText = document.createElement('span');
        headerText.innerText = 'Baboosh Translate';

        headerTitleWrapper.appendChild(headerIcon);
        headerTitleWrapper.appendChild(headerText);
        header.appendChild(headerTitleWrapper);

        // Header actions (audio + close buttons)
        const headerActions = document.createElement('div');
        headerActions.style.display = 'flex';
        headerActions.style.alignItems = 'center';
        headerActions.style.gap = '4px';

        const audioBtn = document.createElement('button');
        audioBtn.className = 'baboosh-audio-btn';
        audioBtn.innerHTML = '🔊 <span>Listen</span>';
        headerActions.appendChild(audioBtn);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'baboosh-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeAllPopups();
        });
        headerActions.appendChild(closeBtn);

        header.appendChild(headerActions);
        translateBox.appendChild(header);

        // Original selected text
        const sourceText = document.createElement('div');
        sourceText.className = 'baboosh-source-text';
        sourceText.innerText = selectedText;
        translateBox.appendChild(sourceText);

        // Divider
        const divider = document.createElement('hr');
        divider.className = 'baboosh-divider';
        translateBox.appendChild(divider);

        // Translation output (spinner while loading)
        const targetText = document.createElement('div');
        targetText.className = 'baboosh-target-text';
        const spinner = document.createElement('div');
        spinner.className = 'baboosh-loading';
        targetText.appendChild(spinner);
        translateBox.appendChild(targetText);

        document.body.appendChild(translateBox);

        // Prevent mousedown inside the box from dismissing it
        translateBox.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        // Auto-play audio if the user's preference is set to 'auto'
        try {
            chrome.storage.sync.get({ audioPref: 'auto' }, (items) => {
                if (items.audioPref === 'auto') {
                    playAudio(selectedText, audioBtn);
                }
            });
        } catch (err) {
            console.warn("Auto-play preference check failed (context likely invalidated):", err);
        }

        // Manual playback via the Listen button
        audioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                unlockAudio();
                playAudio(selectedText, audioBtn);
            } catch (err) {
                console.warn("Audio playback failed:", err);
            }
        });

        // Request translation from background
        try {
            chrome.runtime.sendMessage({ action: "translate_text", text: selectedText }, (response) => {
                targetText.innerHTML = '';
                if (response && response.success) {
                    targetText.innerText = response.translation;
                } else {
                    targetText.innerText = response && response.error ? response.error : "Translation error.";
                }
                // Recalculate position after translation text arrives and box height changes
                repositionBox(rect);
            });
        } catch (err) {
            targetText.innerHTML = '';
            targetText.innerText = "Error connecting to extension.";
        }
    }

    // Initial position
    repositionBox(rect);
}

// Positions (or repositions) the translation box relative to the selection rect.
// Called both on initial render and after translation content loads.
function repositionBox(rect) {
    if (!translateBox) return;

    const boxWidth = translateBox.offsetWidth;
    const boxHeight = translateBox.offsetHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Default: directly below the selection
    let left = rect.left + scrollX;
    let top = rect.bottom + scrollY + 8;

    // Flip above if overflowing bottom
    if (top + boxHeight > scrollY + viewportHeight) {
        top = rect.top + scrollY - boxHeight - 8;
    }

    // Right/left boundary clamp
    if (left + boxWidth > scrollX + viewportWidth) {
        left = scrollX + viewportWidth - boxWidth - 16;
    }
    if (left < scrollX) {
        left = scrollX + 16;
    }

    // Top boundary safety fallback
    if (top < scrollY) {
        top = scrollY + 8;
    }

    translateBox.style.left = `${left}px`;
    translateBox.style.top = `${top}px`;
}

// Dismiss popups when clicking outside them
document.addEventListener('mousedown', (e) => {
    if (floatingIcon && !floatingIcon.contains(e.target)) {
        floatingIcon.remove();
        floatingIcon = null;
    }
    if (translateBox && !translateBox.contains(e.target)) {
        removeAllPopups();
    }
});

function removeAllPopups() {
    audioRequestToken++;
    audioPlaybackToken++;
    if (activeHtmlAudio) {
        activeHtmlAudio.pause();
        activeHtmlAudio = null;
    }
    if (activeAudioSource) {
        activeAudioSource.stop();
        activeAudioSource = null;
    }
    if (floatingIcon) {
        floatingIcon.remove();
        floatingIcon = null;
    }
    if (translateBox) {
        translateBox.remove();
        translateBox = null;
        selectedTextGlobal = "";
    }
}
