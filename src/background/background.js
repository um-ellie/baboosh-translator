chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "translate_text") {
    translateText(message.text, sendResponse);
    return true; // Keeps the message channel open for asynchronous response
  } else if (message.action === "get_audio") {
    fetchAudioDataUrl(message.text, sendResponse);
    return true;
  } else if (message.action === "play_audio_bg") {
    playAudioInBackground(message.text);
    return true;
  }
});

function translateText(text, sendResponse) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&dt=t&q=${encodeURIComponent(text)}`;
  
  fetch(url)
    .then(async response => {
      const textContent = await response.text();
      if (!response.ok || textContent.trim().startsWith('<')) {
        throw new Error("Received non-JSON HTML response from primary endpoint");
      }
      const data = JSON.parse(textContent);
      const translatedText = data[0].map(segment => segment[0]).join('');
      sendResponse({ success: true, translation: translatedText });
    })
    .catch(error => {
      console.warn("Primary translation API error, trying fallback:", error);
      const fallbackUrl = `https://translate.google.as/translate_a/single?client=at&sl=auto&tl=fa&dt=t&q=${encodeURIComponent(text)}`;
      fetch(fallbackUrl)
        .then(async res => {
          const textRes = await res.text();
          if (!res.ok || textRes.trim().startsWith('<')) {
            throw new Error("Received non-JSON HTML response from fallback endpoint");
          }
          const data = JSON.parse(textRes);
          const translatedText = data[0].map(segment => segment[0]).join('');
          sendResponse({ success: true, translation: translatedText });
        })
        .catch(err => {
          console.error("Translation failed:", err);
          sendResponse({ success: false, error: "Translation error." });
        });
    });
}

function fetchAudioDataUrl(text, sendResponse) {
  const encodedText = encodeURIComponent(text);
  const audioUrl = `https://translate.google.as/translate_tts?ie=UTF-8&tl=en-us&client=tw-ob&q=${encodedText}`;

  fetch(audioUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.arrayBuffer();
    })
    .then(buffer => {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      const dataUrl = `data:audio/mp3;base64,${base64}`;
      sendResponse({ success: true, audioDataUrl: dataUrl });
    })
    .catch(error => {
      console.error("Audio fetch from translate.google.as failed, trying fallback:", error);
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-us&client=tw-ob&q=${encodedText}`;
      fetch(fallbackUrl)
        .then(res => res.arrayBuffer())
        .then(buf => {
          let binary = '';
          const bytes = new Uint8Array(buf);
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const dataUrl = `data:audio/mp3;base64,${btoa(binary)}`;
          sendResponse({ success: true, audioDataUrl: dataUrl });
        })
        .catch(err => {
          sendResponse({ success: false, error: err.message });
        });
    });
}

function playAudioInBackground(text) {
  fetchAudioDataUrl(text, (res) => {
    if (res && res.success && res.audioDataUrl) {
      try {
        const audio = new Audio(res.audioDataUrl);
        audio.play().catch(err => console.error("Background audio play failed:", err));
      } catch (e) {
        console.error("Background audio instantiation error:", e);
      }
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "about_baboosh",
    title: "About Baboosh Translate",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "about_baboosh") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/about/about.html")
    });
  }
});