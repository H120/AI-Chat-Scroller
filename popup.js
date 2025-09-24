// Cross-browser API alias
const extApi = typeof browser !== 'undefined' ? browser : chrome;

// Promise/callback wrappers for cross-browser compat
function storageGet(key, cb) {
  try {
    const res = extApi.storage.local.get(key);
    if (res && typeof res.then === 'function') {
      res.then(cb).catch(() => cb({}));
    } else {
      extApi.storage.local.get(key, cb);
    }
  } catch (e) {
    try { extApi.storage.local.get(key, cb); } catch (_) { cb({}); }
  }
}
function storageSet(obj, cb) {
  try {
    const res = extApi.storage.local.set(obj);
    if (res && typeof res.then === 'function') {
      res.then(() => cb && cb()).catch(() => cb && cb());
    } else {
      extApi.storage.local.set(obj, cb);
    }
  } catch (e) {
    try { extApi.storage.local.set(obj, cb); } catch (_) { /* noop */ }
  }
}
function tabsQuery(queryInfo, cb) {
  try {
    const res = extApi.tabs.query(queryInfo);
    if (res && typeof res.then === 'function') {
      res.then(cb).catch(() => cb([]));
    } else {
      extApi.tabs.query(queryInfo, cb);
    }
  } catch (e) {
    try { extApi.tabs.query(queryInfo, cb); } catch (_) { cb([]); }
  }
}
function tabsReload(tabId, cb) {
  try {
    const res = extApi.tabs.reload(tabId);
    if (res && typeof res.then === 'function') {
      res.then(() => cb && cb()).catch(() => cb && cb());
    } else {
      extApi.tabs.reload(tabId, cb);
    }
  } catch (e) {
    try { extApi.tabs.reload(tabId, cb); } catch (_) { /* noop */ }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const enableButton = document.getElementById('enableButton');
  const donateButton = document.getElementById('donateButton');

  // Ensure default value exists in extension storage
  storageGet('aiscroller_enabled', function (result) {
    if (result.aiscroller_enabled === undefined) {
      storageSet({ aiscroller_enabled: true });
    }
    updateBtn();
  });

  // Update button label based on stored value
  function updateBtn() {
    storageGet('aiscroller_enabled', function (result) {
      const enabled = result.aiscroller_enabled !== false;
      enableButton.textContent = enabled ? 'Extension Enabled' : 'Extension Disabled';
      enableButton.style.backgroundColor = enabled? '#00a6ed' : '#dc3545';
    });
  }

  // Handle button click
  enableButton.addEventListener('click', () => {
    storageGet('aiscroller_enabled', function (result) {
      const currentlyEnabled = result.aiscroller_enabled !== false;
      const newState = !currentlyEnabled;
      tabsQuery({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0]) {
          tabsReload(tabs[0].id, () => {});
        }
      });
      storageSet({ aiscroller_enabled: newState }, function () {
        updateBtn();
      });
    });
  });

  donateButton.addEventListener('click', () => {
    alert('Thank you, but just send me an email! :]');
  });
});