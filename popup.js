if(localStorage.getItem('aiscroller_enabled')==null){
    enabled = localStorage.setItem('aiscroller_enabled', 'true');
}
document.addEventListener('DOMContentLoaded', function() {
  enableButton = document.getElementById('enableButton');
  donateButton = document.getElementById('donateButton');

// Update button label based on stored value
function updateBtn() {
  chrome.storage.local.get('aiscroller_enabled', function (result) {
    const enabled = result.aiscroller_enabled !== false;
    enableButton.textContent = enabled ? 'Extension Enabled' : 'Extension Disabled';
    enableButton.style.backgroundColor = enabled? '#00a6ed' : '#dc3545';
  });
}

// Handle button click
enableButton.addEventListener('click', () => {
  chrome.storage.local.get('aiscroller_enabled', function (result) {
    const currentlyEnabled = result.aiscroller_enabled !== false;
    const newState = !currentlyEnabled;
      // Reload the current tab
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
      chrome.storage.local.set({ aiscroller_enabled: newState }, function () {
      updateBtn(); // update the button label
    });
  });
});

// Initial load
updateBtn();
donateButton.addEventListener('click', () => {
  alert('Thank you, but just send me an email! :]');
});
});