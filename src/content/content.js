let shadowHost = null;
let shadowRoot = null;
let floatingIcon = null;
let translateBox = null;
let selectedTextGlobal = "";
let audioContext = null;
let activeAudioSource = null;
let activeHtmlAudio = null;
let audioPlaybackToken = 0;
let audioRequestToken = 0;
let selectionDebounceTimer = null;

function initShadowRoot() {
    if (shadowHost) return;
    shadowHost = document.createElement('div');
    shadowHost.id = 'baboosh-translator-host';
    // position absolute with size 0, so it doesn't affect page layout
    // pointer-events none so it doesn't block clicks on the page
    shadowHost.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; overflow: visible; z-index: 2147483647; pointer-events: none;';
    document.body.appendChild(shadowHost);

    shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    
    // Inject styles
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.runtime.getURL('src/content/style.css');
    shadowRoot.appendChild(styleLink);
    
    // Inject a local style to re-enable pointer events for the UI components
    const localStyle = document.createElement('style');
    localStyle.textContent = '#baboosh-floating-icon, #baboosh-main-box { pointer-events: auto; }';
    shadowRoot.appendChild(localStyle);
}

// Resume the Web Audio context while the user is interacting with the page.
function unlockAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
    }
}

function playAudio(text, lang, btnElement = null) {
    const requestToken = ++audioRequestToken;
    if (btnElement) btnElement.classList.add('btPlaying');

    const removePlayingClass = () => {
        if (btnElement) btnElement.classList.remove('btPlaying');
    };

    try {
        chrome.runtime.sendMessage({ action: "get_audio", text: text, lang: lang }, (response) => {
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

    clearTimeout(selectionDebounceTimer);
    selectionDebounceTimer = setTimeout(handleSelection, 200);
});

function handleSelection() {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';

    if (!text) {
        if (!translateBox && floatingIcon) {
            floatingIcon.remove();
            floatingIcon = null;
        }
        return;
    }

    if (!selection || selection.rangeCount === 0) {
        return;
    }

    selectedTextGlobal = text;
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    if (rects.length === 0) return;

    const lastRect = rects[rects.length - 1];

    if (translateBox) return;

    initShadowRoot();

    if (!floatingIcon) {
        floatingIcon = document.createElement('img');
        floatingIcon.id = 'baboosh-floating-icon';
        floatingIcon.src = chrome.runtime.getURL('src/assets/icon48.png');
        shadowRoot.appendChild(floatingIcon);

        floatingIcon.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            unlockAudio();
            showTranslationBox(lastRect);
        });
    }

    const iconSize = 36;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let iconLeft = lastRect.right + scrollX + 5;
    let iconTop = lastRect.bottom + scrollY + 5;

    if (iconLeft + iconSize > scrollX + viewportWidth) {
        iconLeft = scrollX + viewportWidth - iconSize - 10;
    }
    if (iconLeft < scrollX) {
        iconLeft = scrollX + 10;
    }
    if (iconTop + iconSize > scrollY + viewportHeight) {
        iconTop = lastRect.top + scrollY - iconSize - 5;
    }
    if (iconTop < scrollY) {
        iconTop = scrollY + 10;
    }

    floatingIcon.style.left = `${iconLeft}px`;
    floatingIcon.style.top = `${iconTop}px`;
}

function showTranslationBox(rect) {
    if (floatingIcon) {
        floatingIcon.remove();
        floatingIcon = null;
    }

    if (!translateBox) {
        const selectedText = selectedTextGlobal;
        translateBox = document.createElement('div');
        translateBox.id = 'baboosh-main-box';

        const header = document.createElement('div');
        header.className = 'baboosh-header';

        const headerTitleWrapper = document.createElement('div');
        headerTitleWrapper.className = 'baboosh-header-title-wrapper';

        const headerIcon = document.createElement('img');
        headerIcon.className = 'baboosh-header-icon';
        headerIcon.src = chrome.runtime.getURL('src/assets/icon48.png');

        const headerText = document.createElement('span');
        headerText.innerText = chrome.i18n.getMessage('extName') || 'Baboosh Translate';

        headerTitleWrapper.appendChild(headerIcon);
        headerTitleWrapper.appendChild(headerText);
        header.appendChild(headerTitleWrapper);

        const headerActions = document.createElement('div');
        headerActions.style.display = 'flex';
        headerActions.style.alignItems = 'center';
        headerActions.style.gap = '4px';

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

        // SOURCE TEXT ROW
        const sourceRow = document.createElement('div');
        sourceRow.className = 'baboosh-text-row';
        
        const sourceTextEl = document.createElement('div');
        sourceTextEl.className = 'baboosh-source-text';
        sourceTextEl.innerText = selectedText;
        sourceRow.appendChild(sourceTextEl);
        
        const sourceAudioBtn = document.createElement('button');
        sourceAudioBtn.className = 'baboosh-icon-btn';
        sourceAudioBtn.innerHTML = '🔊';
        sourceRow.appendChild(sourceAudioBtn);
        
        translateBox.appendChild(sourceRow);

        const divider = document.createElement('hr');
        divider.className = 'baboosh-divider';
        translateBox.appendChild(divider);

        // TARGET TEXT ROW
        const targetRow = document.createElement('div');
        targetRow.className = 'baboosh-text-row';
        
        const targetTextEl = document.createElement('div');
        targetTextEl.className = 'baboosh-target-text';
        const spinner = document.createElement('div');
        spinner.className = 'baboosh-loading';
        targetTextEl.appendChild(spinner);
        targetRow.appendChild(targetTextEl);
        
        const targetAudioBtn = document.createElement('button');
        targetAudioBtn.className = 'baboosh-icon-btn';
        targetAudioBtn.innerHTML = '🔊';
        targetAudioBtn.style.display = 'none';
        targetRow.appendChild(targetAudioBtn);
        
        translateBox.appendChild(targetRow);

        shadowRoot.appendChild(translateBox);

        translateBox.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        // Initialize state variables for language info
        let detectedSourceLang = null;
        let finalTargetLang = null;
        let translatedTextStr = null;

        try {
            chrome.storage.sync.get({ audioPref: 'auto' }, (items) => {
                if (items.audioPref === 'auto') {
                    playAudio(selectedText, null, sourceAudioBtn); 
                }
            });
        } catch (err) {
            console.warn("Auto-play preference check failed:", err);
        }

        sourceAudioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                unlockAudio();
                playAudio(selectedText, detectedSourceLang, sourceAudioBtn);
            } catch (err) {
                console.warn("Audio playback failed:", err);
            }
        });
        
        targetAudioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                unlockAudio();
                if (translatedTextStr) {
                    playAudio(translatedTextStr, finalTargetLang, targetAudioBtn);
                }
            } catch (err) {
                console.warn("Audio playback failed:", err);
            }
        });

        try {
            chrome.runtime.sendMessage({ action: "translate_text", text: selectedText }, (response) => {
                targetTextEl.innerHTML = '';
                if (response && response.success) {
                    translatedTextStr = response.translation;
                    detectedSourceLang = response.sourceLang;
                    finalTargetLang = response.targetLang;
                    targetTextEl.innerText = translatedTextStr;
                    
                    if (finalTargetLang === 'fa' || finalTargetLang === 'ar') {
                        targetTextEl.style.setProperty('direction', 'rtl', 'important');
                        targetTextEl.style.setProperty('text-align', 'right', 'important');
                    } else {
                        targetTextEl.style.setProperty('direction', 'ltr', 'important');
                        targetTextEl.style.setProperty('text-align', 'left', 'important');
                    }
                    
                    if (detectedSourceLang === 'fa' || detectedSourceLang === 'ar') {
                        sourceTextEl.style.setProperty('direction', 'rtl', 'important');
                        sourceTextEl.style.setProperty('text-align', 'right', 'important');
                    } else {
                        sourceTextEl.style.setProperty('direction', 'ltr', 'important');
                        sourceTextEl.style.setProperty('text-align', 'left', 'important');
                    }
                    targetAudioBtn.style.display = 'inline-flex';
                } else {
                    targetTextEl.innerText = response && response.error ? response.error : "Translation error.";
                }
                repositionBox(rect);
            });
        } catch (err) {
            targetTextEl.innerHTML = '';
            targetTextEl.innerText = "Error connecting to extension.";
        }
    }

    repositionBox(rect);
}

function repositionBox(rect) {
    if (!translateBox) return;

    const boxWidth = translateBox.offsetWidth;
    const boxHeight = translateBox.offsetHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let left = rect.left + scrollX;
    let top = rect.bottom + scrollY + 8;

    if (top + boxHeight > scrollY + viewportHeight) {
        top = rect.top + scrollY - boxHeight - 8;
    }

    if (left + boxWidth > scrollX + viewportWidth) {
        left = scrollX + viewportWidth - boxWidth - 16;
    }
    if (left < scrollX) {
        left = scrollX + 16;
    }

    if (top < scrollY) {
        top = scrollY + 8;
    }

    translateBox.style.left = `${left}px`;
    translateBox.style.top = `${top}px`;
}

// Dismiss popups when clicking outside them
document.addEventListener('mousedown', (e) => {
    // If the click is inside the shadow DOM (like on our popup or icon), do nothing.
    if (shadowHost && e.composedPath().includes(shadowHost)) {
        return;
    }
    removeAllPopups();
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
