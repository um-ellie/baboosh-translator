let floatingIcon = null;
let translateBox = null;
let selectedTextGlobal = "";

// Professional Approach: Listen for mouse/pointer release instead of continuous selection changes
document.addEventListener('pointerup', handleTextSelection);

function handleTextSelection() {
    // 1. Guard Clause: Safely check extension runtime validity
    try {
        if (!chrome.runtime || !chrome.runtime.id) return;
    } catch (e) {
        removeAllPopups();
        return;
    }

    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    // If no text is selected, stop execution immediately
    if (!text) return;
    
    selectedTextGlobal = text;
    
    // 2. Geometry Calculation
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    if (rects.length === 0) return;
    
    const lastRect = rects[rects.length - 1];
    
    // If the main translation box is already open, do not show the small icon again
    if (translateBox) return;

    // 3. Floating Action Button Management
    if (!floatingIcon) {
        floatingIcon = document.createElement('img');
        floatingIcon.id = 'gtranslate-floating-icon';
        // Updated path alignment to match production repository structure
        floatingIcon.src = chrome.runtime.getURL('src/assets/icon48.png'); 
        document.body.appendChild(floatingIcon);
        
        floatingIcon.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showTranslationBox(lastRect);
        });
    }
    
    // Position the icon near the selection coordinates safely
    floatingIcon.style.left = `${lastRect.right + window.scrollX + 5}px`;
    floatingIcon.style.top = `${lastRect.bottom + window.scrollY + 5}px`;
}

function showTranslationBox(rect) {
    if (floatingIcon) {
        floatingIcon.remove();
        floatingIcon = null;
    }

    if (!translateBox) {
        translateBox = document.createElement('div');
        translateBox.id = 'gtranslate-main-box';
        
        // Header Assembly
        const header = document.createElement('div');
        header.className = 'gtranslate-header';

        const headerTitleWrapper = document.createElement('div');
        headerTitleWrapper.className = 'gtranslate-header-title-wrapper';

        const headerIcon = document.createElement('img');
        headerIcon.className = 'gtranslate-header-icon';
        headerIcon.src = chrome.runtime.getURL('src/assets/icon48.png'); 

        const headerText = document.createElement('span');
        headerText.innerText = 'Baboosh Translate';

        headerTitleWrapper.appendChild(headerIcon);
        headerTitleWrapper.appendChild(headerText);
        header.appendChild(headerTitleWrapper);

        // Audio Activation Component
        const audioBtn = document.createElement('button');
        audioBtn.className = 'gtranslate-audio-btn';
        audioBtn.innerHTML = '🔊 <span>Listen</span>';
        header.appendChild(audioBtn);
        
        translateBox.appendChild(header);

        // Source Content View
        const sourceText = document.createElement('div');
        sourceText.className = 'gtranslate-source-text';
        sourceText.innerText = selectedTextGlobal;
        translateBox.appendChild(sourceText);

        const divider = document.createElement('hr');
        divider.className = 'gtranslate-divider';
        translateBox.appendChild(divider);
        
        // Translated Content View State
        const targetText = document.createElement('div');
        targetText.className = 'gtranslate-target-text';
        targetText.innerText = 'Translating...';
        translateBox.appendChild(targetText);
        
        document.body.appendChild(translateBox);
        
        translateBox.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        // Event Interceptors
        audioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                chrome.runtime.sendMessage({ action: "play_audio", text: selectedTextGlobal });
            } catch (err) {
                console.warn("Context invalidated.");
            }
        });

        // Communication Bridge to Background Service Worker
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
    
    translateBox.style.left = `${rect.left + window.scrollX}px`;
    translateBox.style.top = `${rect.bottom + window.scrollY + 10}px`;
}

// Global dismiss clicks
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