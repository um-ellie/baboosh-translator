function saveOptions() {
  const audioPreference = document.querySelector('input[name="audioPref"]:checked').value;
  
  chrome.storage.sync.set({ audioPref: audioPreference }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved successfully.';
    status.classList.add('show');
    
    // Smoothly fade out the banner after 2 seconds
    setTimeout(() => { 
      status.classList.remove('show'); 
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ audioPref: 'auto' }, (items) => {
    document.querySelector(`input[name="audioPref"][value="${items.audioPref}"]`).checked = true;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelectorAll('input[name="audioPref"]').forEach(radio => {
  radio.addEventListener('change', saveOptions);
});