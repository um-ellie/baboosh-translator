chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "start_playback") {
    const audio = new Audio(message.url);
    audio.play()
      .then(() => console.log("Audio playing successfully."))
      .catch(err => console.error("Audio playback failed in offscreen:", err));
  }
});