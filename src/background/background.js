chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "play_audio") {
    playAudioOffscreen(message.text);
  }
  
  if (message.action === "translate_text") {
    translateText(message.text, sendResponse);
    return true; // Keeps the message channel open for asynchronous response
  }
});

async function playAudioOffscreen(text) {
  const encodedText = encodeURIComponent(text);
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-us&client=tw-ob&q=${encodedText}`;

  if (!(await chrome.offscreen.hasDocument?.())) {
    // Fixed: Pointed path to the isolated offscreen directory
    await chrome.offscreen.createDocument({
      url: 'src/offscreen/audio.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play Google Translate TTS audio'
    });
  }

  chrome.runtime.sendMessage({ action: "start_playback", url: audioUrl });
}

function translateText(text, sendResponse) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&dt=t&q=${encodeURIComponent(text)}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const translatedText = data[0].map(segment => segment[0]).join('');
      sendResponse({ success: true, translation: translatedText });
    })
    .catch(error => {
      console.error("Translation failed:", error);
      sendResponse({ success: false, error: error.message });
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
    // Fixed: Pointed path to the specific about directory
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/about/about.html")
    });
  }
});