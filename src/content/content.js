let floatingIcon = null;
let translateBox = null;
let selectedTextGlobal = "";

document.addEventListener('selectionchange', () => {
    try {
        if (!chrome.runtime || !chrome.runtime.id) return;
    } catch (e) {
        removeAllPopups();
        return;
    }

    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (!text) {
        return;
    }
    
    selectedTextGlobal = text;
    
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    if (rects.length === 0) return;
    
    const lastRect = rects[rects.length - 1];
    
    // If the main translation box is already open, don't show the small icon again
    if (translateBox) return;

    if (!floatingIcon) {
        // Create the small cute cat floating action button as an image element
        floatingIcon = document.createElement('img');
        floatingIcon.id = 'gtranslate-floating-icon';
        floatingIcon.src = chrome.runtime.getURL('src/assets/icon48.png'); 
        document.body.appendChild(floatingIcon);
        
        floatingIcon.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showTranslationBox(lastRect);
        });
    }
    
    // --- INTELLIGENT ICON POSITIONING ---
    const iconSize = 34; // Matches the 34px width/height from style.css
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
    // Boundary Protection: Bottom edge
    if (iconTop + iconSize > scrollY + viewportHeight) {
        // Flip it above the text if it runs out of vertical space at the bottom
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
        translateBox = document.createElement('div');
        translateBox.id = 'gtranslate-main-box';
        
        // Header with Header-Content wrapper to support top audio button layout
        const header = document.createElement('div');
        header.className = 'gtranslate-header';

        const headerTitleWrapper = document.createElement('div');
        headerTitleWrapper.className = 'gtranslate-header-title-wrapper';

        // Create an image element for the cute cat icon
        const headerIcon = document.createElement('img');
        headerIcon.className = 'gtranslate-header-icon';
        headerIcon.src = chrome.runtime.getURL('src/assets/icon48.png'); 

        const headerText = document.createElement('span');
        headerText.innerText = 'Baboosh Translate';

        headerTitleWrapper.appendChild(headerIcon);
        headerTitleWrapper.appendChild(headerText);
        header.appendChild(headerTitleWrapper);

        // Audio Button moved to the top header right side
        const audioBtn = document.createElement('button');
        audioBtn.className = 'gtranslate-audio-btn';
        audioBtn.innerHTML = '🔊 <span>Listen</span>';
        header.appendChild(audioBtn);
        
        translateBox.appendChild(header);

        // Original Text Section
        const sourceText = document.createElement('div');
        sourceText.className = 'gtranslate-source-text';
        sourceText.innerText = selectedTextGlobal;
        translateBox.appendChild(sourceText);

        // Divider
        const divider = document.createElement('hr');
        divider.className = 'gtranslate-divider';
        translateBox.appendChild(divider);
        
        // Translation Content Section
        const targetText = document.createElement('div');
        targetText.className = 'gtranslate-target-text';
        targetText.innerText = 'Translating...';
        translateBox.appendChild(targetText);
        
        document.body.appendChild(translateBox);
        
        translateBox.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        // 1. CONDITIONAL AUTOMATIC PLAYBACK: Check preference before playing immediately
        try {
            chrome.storage.sync.get({ audioPref: 'auto' }, (items) => {
                if (items.audioPref === 'auto') {
                    chrome.runtime.sendMessage({ action: "play_audio", text: selectedTextGlobal });
                }
            });
        } catch (err) {
            console.warn("Auto-play preference check failed or context invalidated:", err);
        }

        // 2. MANUAL PLAYBACK: Listen again when clicking the audio button
        audioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                chrome.runtime.sendMessage({ action: "play_audio", text: selectedTextGlobal });
            } catch (err) {
                console.warn("Context invalidated.");
            }
        });

        // Request translation from background
        try {
            chrome.runtime.sendMessage({ action: "translate_text", text: selectedTextGlobal }, (response) => {
                if (response && response.success) {
                    targetText.innerText = response.translation;
                } else {
                    targetText.innerText = "Translation error.";
                }
                // Recalculate position dynamically if content height changed after translation text arrives
                repositionBox(rect);
            });
        } catch (err) {
            targetText.innerText = "Error connecting to extension.";
        }
    }
    
    // Initial layout position calculation
    repositionBox(rect);
}

// Extracted positioning into a reusable function to allow updates post-translation injection
function repositionBox(rect) {
    if (!translateBox) return;

    const boxWidth = translateBox.offsetWidth;
    const boxHeight = translateBox.offsetHeight;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Default positioning: directly below the text selection bounding rectangle
    let left = rect.left + scrollX;
    let top = rect.bottom + scrollY + 8;

    // If box overflows bottom viewport bounds, flip it cleanly ABOVE the selection text.
    if (top + boxHeight > scrollY + viewportHeight) {
        top = rect.top + scrollY - boxHeight - 8;
    }

    // Safety edge bounds adjustments (Left & Right boundaries)
    if (left + boxWidth > scrollX + viewportWidth) {
        left = scrollX + viewportWidth - boxWidth - 16;
    }
    if (left < scrollX) {
        left = scrollX + 16;
    }
    if (top < scrollY) {
        top = scrollY + 8; // Extreme case fallback protection
    }

    translateBox.style.left = `${left}px`;
    translateBox.style.top = `${top}px`;
}

// Close everything when clicking outside
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