chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message.text !== 'string') return;
  if (message.action === "translate_text") {
    translateText(message.text, sendResponse);
    return true; // Keep channel open for async response
  } else if (message.action === "get_audio") {
    fetchAudioDataUrl(message.text, sendResponse);
    return true; // Keep channel open for async response
  }
});

function translateText(text, sendResponse) {
  const normalizedText = text.trim();
  if (!normalizedText) {
    sendResponse({ success: false, error: "No text selected." });
    return;
  }
  if (normalizedText.length > 5000) {
    sendResponse({ success: false, error: "Please select 5,000 characters or fewer." });
    return;
  }
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&dt=t&q=${encodeURIComponent(normalizedText)}`;

  fetch(url)
    .then(async response => {
      const textContent = await response.text();
      if (!response.ok || textContent.trim().startsWith('<')) {
        throw new Error("Received non-JSON response from primary endpoint");
      }
      const data = JSON.parse(textContent);
      const translatedText = data[0].map(segment => segment[0]).join('');
      sendResponse({ success: true, translation: translatedText });
    })
    .catch(error => {
      console.warn("Primary translation API failed, trying fallback:", error);
      const fallbackUrl = `https://translate.google.as/translate_a/single?client=at&sl=auto&tl=fa&dt=t&q=${encodeURIComponent(normalizedText)}`;
      fetch(fallbackUrl)
        .then(async res => {
          const textRes = await res.text();
          if (!res.ok || textRes.trim().startsWith('<')) {
            throw new Error("Received non-JSON response from fallback endpoint");
          }
          const data = JSON.parse(textRes);
          const translatedText = data[0].map(segment => segment[0]).join('');
          sendResponse({ success: true, translation: translatedText });
        })
        .catch(err => {
          console.error("Translation failed on both endpoints:", err);
          sendResponse({ success: false, error: "Translation error." });
        });
    });
}

function fetchAudioDataUrl(text, sendResponse) {
  const chunks = splitTextForTts(text);
  if (!chunks.length) {
    sendResponse({ success: false, error: "No text selected." });
    return;
  }
  if (chunks.length > 30) {
    sendResponse({ success: false, error: "Please select a shorter passage for pronunciation." });
    return;
  }

  Promise.all(chunks.map(fetchAudioChunk))
    .then(audioDataUrls => sendResponse({ success: true, audioDataUrls }))
    .catch(error => {
      console.error("TTS fetch failed:", error);
      sendResponse({ success: false, error: "Pronunciation is temporarily unavailable." });
    });
}

function splitTextForTts(text) {
  const maxLength = 180;
  const words = text.trim().split(/\s+/);
  const chunks = [];
  let chunk = '';
  
  for (const word of words) {
    if (word.length > maxLength) {
      // Word is too long, must split it
      if (chunk) {
        chunks.push(chunk);
        chunk = '';
      }
      let remainingWord = word;
      while (remainingWord.length > 0) {
        chunks.push(remainingWord.substring(0, maxLength));
        remainingWord = remainingWord.substring(maxLength);
      }
      continue;
    }
    
    const candidate = chunk ? `${chunk} ${word}` : word;
    if (candidate.length > maxLength) {
      chunks.push(chunk);
      chunk = word;
    } else {
      chunk = candidate;
    }
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

async function fetchAudioChunk(text) {
  const encodedText = encodeURIComponent(text);
  const urls = [
    `https://translate.google.as/translate_tts?ie=UTF-8&tl=en-us&client=tw-ob&q=${encodedText}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-us&client=tw-ob&q=${encodedText}`
  ];
  let lastError;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return arrayBufferToDataUrl(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

// Convert an ArrayBuffer to a base64-encoded audio/mp3 data URL.
// This is done in the background so the content script can play it
// without being blocked by page CSP or CORS restrictions.
function arrayBufferToDataUrl(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/mp3;base64,${btoa(binary)}`;
}

// "About Baboosh Translate" appears in the extension action's context menu
// (contexts: ["action"]), not as a page right-click item. The try/catch
// makes creation idempotent on extension reload — Chrome throws if the ID
// already exists, Firefox silently ignores the duplicate.
chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.contextMenus.create({
      id: "about_baboosh",
      title: "About Baboosh Translate",
      contexts: ["action"]
    });
  } catch (e) {
    // Item already exists (e.g. after a dev reload); safe to ignore.
  }
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "about_baboosh") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/about/about.html")
    });
  }
});


// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { splitTextForTts };
}
