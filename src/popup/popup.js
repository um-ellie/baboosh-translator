document.addEventListener('DOMContentLoaded', () => {
  const audioToggle = document.getElementById('instantAudioToggle');
  const btnUS = document.getElementById('btnAccentUS');
  const btnUK = document.getElementById('btnAccentUK');
  const updateAccentUI = (accent) => {
    btnUS.classList.toggle('active', accent === 'en-us');
    btnUK.classList.toggle('active', accent === 'en-gb');
  };
  const langSelect = document.getElementById('popupLangSelect');
  const optionsLink = document.getElementById('openOptions');
  const aboutLink = document.getElementById('openAbout');

  // Load existing preference
  chrome.storage.sync.get({ audioPref: 'auto', accentPref: 'en-us', targetLang: 'fa' }, (items) => {
    audioToggle.checked = (items.audioPref === 'auto');
    updateAccentUI(items.accentPref);
    langSelect.value = items.targetLang;
  });

  audioToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ audioPref: audioToggle.checked ? 'auto' : 'manual' });
  });
  
  btnUS.addEventListener('click', () => {
    chrome.storage.sync.set({ accentPref: 'en-us' });
    updateAccentUI('en-us');
  });
  btnUK.addEventListener('click', () => {
    chrome.storage.sync.set({ accentPref: 'en-gb' });
    updateAccentUI('en-gb');
  });
  
  langSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ targetLang: langSelect.value });
  });

  optionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('src/about/about.html') });
  });
});
