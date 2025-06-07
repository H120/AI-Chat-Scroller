document.addEventListener('DOMContentLoaded', function () {
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
  const enableButton = document.getElementById('enableButton');
  const donateButton = document.getElementById('donateButton');

  // Initialize state if not set
  browserAPI.storage.local.get('aiscroller_enabled', function (result) {
    if (result.aiscroller_enabled === undefined) {
      browserAPI.storage.local.set({ aiscroller_enabled: true });
    }
  });

  // Update button label and style
  function updateBtn() {
    browserAPI.storage.local.get('aiscroller_enabled', function (result) {
      const enabled = result.aiscroller_enabled !== false;
      enableButton.textContent = enabled ? 'Disable Extension' : 'Enable Extension';
      enableButton.style.backgroundColor = enabled ? '#00a6ed' : '#dc3545';
    });
  }

  // Handle button click
  enableButton.addEventListener('click', () => {
    browserAPI.storage.local.get('aiscroller_enabled', function (result) {
      const newState = !result.aiscroller_enabled;
      browserAPI.storage.local.set({ aiscroller_enabled: newState }, function () {
        updateBtn();
        // Reload the current tab
        browserAPI.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          browserAPI.tabs.reload(tabs[0].id);
        });
      });
    });
  });

  // Handle donate button click
  donateButton.addEventListener('click', () => {
    alert('Thank you! Please send an email to h120com@gmail.com for donation details.');
  });

  // Initial load
  updateBtn();
});