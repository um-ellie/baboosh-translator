document.addEventListener('DOMContentLoaded', () => {
  const audioToggle = document.getElementById('instantAudioToggle');
  const optionsLink = document.getElementById('openOptions');
  const aboutLink = document.getElementById('openAbout');

  // Load existing preference to initialize the toggle switch state
  chrome.storage.sync.get({ audioPref: 'auto' }, (items) => {
    audioToggle.checked = (items.audioPref === 'auto');
  });

  // Toggle audio preference instantly from the popup menu
  audioToggle.addEventListener('change', () => {
    const newPref = audioToggle.checked ? 'auto' : 'manual';
    chrome.storage.sync.set({ audioPref: newPref });
  });

  // Open Options page securely inside a standard browser tab
  optionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('src/options/options.html') });
    }
  });

  // Open About page securely inside a new browser tab
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('src/about/about.html') });
  });
});