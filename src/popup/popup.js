document.addEventListener('DOMContentLoaded', () => {
  const audioToggle = document.getElementById('instantAudioToggle');
  const optionsLink = document.getElementById('openOptions');
  const aboutLink = document.getElementById('openAbout');

  // Load existing preference to initialise the toggle switch state
  chrome.storage.sync.get({ audioPref: 'auto' }, (items) => {
    audioToggle.checked = (items.audioPref === 'auto');
  });

  // Toggle audio preference instantly from the popup
  audioToggle.addEventListener('change', () => {
    const newPref = audioToggle.checked ? 'auto' : 'manual';
    chrome.storage.sync.set({ audioPref: newPref });
  });

  // Open the Options page (both Firefox 142+ and Chrome support openOptionsPage)
  optionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  // Open the About page in a new tab
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('src/about/about.html') });
  });
});