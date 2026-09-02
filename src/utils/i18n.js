document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-i18n]');
  for (const element of elements) {
    const messageId = element.getAttribute('data-i18n');
    const message = chrome.i18n.getMessage(messageId);
    if (message) {
      // Allow HTML in translations (useful for spans or formatting if needed, but innerText is safer)
      // Since it's our own JSON, innerHTML is fine, but innerText is used here for safety
      if (element.tagName === 'INPUT' && element.type === 'button') {
        element.value = message;
      } else {
        element.innerText = message;
      }
    }
  }
  
  // Set document dir based on locale
  if (chrome.i18n.getUILanguage().startsWith('fa') || chrome.i18n.getUILanguage().startsWith('ar')) {
    document.body.dir = 'rtl';
  } else {
    document.body.dir = 'ltr';
  }
});
