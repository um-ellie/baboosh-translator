document.addEventListener('DOMContentLoaded', () => {
  const audioRadios = document.getElementsByName('audioPref');
  const accentRadios = document.getElementsByName('accentPref');
  const langSelect = document.getElementById('targetLangSelect');
  const statusEl = document.getElementById('status');

  // Load existing preferences
  chrome.storage.sync.get({ audioPref: 'auto', accentPref: 'en-us', targetLang: 'fa' }, (items) => {
    for (const radio of audioRadios) {
      if (radio.value === items.audioPref) radio.checked = true;
    }
    for (const radio of accentRadios) {
      if (radio.value === items.accentPref) radio.checked = true;
    }
    langSelect.value = items.targetLang;
  });

  const saveOptions = () => {
    let audioVal = 'auto';
    for (const radio of audioRadios) {
      if (radio.checked) audioVal = radio.value;
    }
    
    let accentVal = 'en-us';
    for (const radio of accentRadios) {
      if (radio.checked) accentVal = radio.value;
    }

    const langVal = langSelect.value;

    chrome.storage.sync.set({ audioPref: audioVal, accentPref: accentVal, targetLang: langVal }, () => {
      statusEl.textContent = chrome.i18n.getMessage("optionsTitle") ? 'Saved!' : 'Saved!'; // TODO i18n save msg if needed, but keeping it simple
      statusEl.classList.add('show');
      setTimeout(() => statusEl.classList.remove('show'), 2000);
    });
  };

  for (const radio of audioRadios) {
    radio.addEventListener('change', saveOptions);
  }
  for (const radio of accentRadios) {
    radio.addEventListener('change', saveOptions);
  }
  langSelect.addEventListener('change', saveOptions);
});
