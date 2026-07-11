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
    
    // Position the small floating icon right above or near the selection
    floatingIcon.style.left = `${lastRect.right + window.scrollX + 5}px`;
    floatingIcon.style.top = `${lastRect.bottom + window.scrollY + 5}px`;
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
            });
        } catch (err) {
            targetText.innerText = "Error connecting to extension.";
        }
    }
    
    // Position the main box nicely below the selection
    translateBox.style.left = `${rect.left + window.scrollX}px`;
    translateBox.style.top = `${rect.bottom + window.scrollY + 10}px`;
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