aiscroller_enabled = null;

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

function urlCheck() {
  console.log(aiscroller_enabled)
  if (aiscroller_enabled) {
    console.log("Scroller script disabled: aiscroller_enabled is true.");

    const currentUrl = window.location.href;
    selector = '';
    const validUrls = [
      "https://chatgpt.com/",
      "https://grok.com/chat/",
      "https://claude.ai/chat/",
      "https://copilot.microsoft.com/chats/"
    ];
    targetDivs = [];
    if (currentUrl.startsWith("https://chatgpt.com/c/") || currentUrl.startsWith("chatgpt.com/c/") || currentUrl.startsWith("https://chatgpt.com/share/") || currentUrl.startsWith("chatgpt.com/share/")) {
      selector = "article.text-token-text-primary.w-full";
    } else if (currentUrl.startsWith("https://grok.com/chat/") || currentUrl.startsWith("grok.com/chat/")) {
      selector = ".relative.group.flex.flex-col.justify-center.w-full.max-w-3xl";
    } else if (currentUrl.startsWith("https://claude.ai/chat/") || currentUrl.startsWith("claude.ai/chat/")) {
      selector = "div[data-test-render-count]";
    } else if (currentUrl.startsWith("https://copilot.microsoft.com/chats/") || currentUrl.startsWith("copilot.microsoft.com/chats/")) {
      selector = 'div[data-tabster="{"groupper":{"tabbability":2},"focusable":{}}"], div[data-tabster]';
    }
    if (!validUrls.some(url => currentUrl.startsWith(url))) {
      console.log("Scroller script disabled: not a valid URL.");
      return;
    } else {
      console.log("Scroller script started.");
      initializeVal();
      aiFun(currentUrl);
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.matches &&
                node.matches(selector)
              ) {
                aiFun(currentUrl);
              }
            });
            mutation.removedNodes.forEach((node) => {
              if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.matches &&
                node.matches(selector)
              ) {
                aiFun(currentUrl);
              }
            });
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }
}

function initializeVal() {
  pinnedMessageLimit = 200;
  currentIndex = 0;
  initializeUi();
}

function initializeUi() {
  upBtn = document.createElement('button');
  downBtn = document.createElement('button');
  counter = document.createElement('div');
  toggleBtn = document.createElement('button');
  scrollerButtonDiv = document.createElement('div');
  bookmarkViewer = document.createElement('div');
  scrollerDiv = document.createElement('div');
  firstBtn = document.createElement('button');
  lastBtn = document.createElement('button');

  // Go to First button
  firstBtn.innerText = "🢁🢁";
  firstBtn.title = "Go to First";
  firstBtn.style.backgroundColor = "#00a6ed";
  firstBtn.style.border = "none";
  firstBtn.style.borderRadius = "10px 10px 0 0";
  firstBtn.style.textAlign = "center";
  firstBtn.style.fontSize = "0.6vw";
  firstBtn.style.width = "fit-content";
  firstBtn.style.minWidth = "1.8vw";
  firstBtn.style.height = "fit-content";
  firstBtn.style.padding = "3px";
  firstBtn.style.margin = "auto";
  firstBtn.style.visibility = "hidden";
  firstBtn.style.opacity = "0";
  firstBtn.style.transition = "opacity 0.3s ease";

  // Go to Last button
  lastBtn.innerText = "🢃🢃";
  lastBtn.title = "Go to Last";
  lastBtn.style.backgroundColor = "#00a6ed";
  lastBtn.style.border = "none";
  lastBtn.style.borderRadius = "0 0 10px 10px";
  lastBtn.style.textAlign = "center";
  lastBtn.style.fontSize = "0.6vw";
  lastBtn.style.width = "fit-content";
  lastBtn.style.minWidth = "1.8vw";
  lastBtn.style.height = "fit-content";
  lastBtn.style.padding = "3px";
  lastBtn.style.margin = "auto";
  lastBtn.style.visibility = "hidden";
  lastBtn.style.opacity = "0";
  lastBtn.style.transition = "opacity 0.3s ease";

  // Scroll buttons
  upBtn.innerText = "🢁";
  upBtn.title = "Scroll Up";
  upBtn.style.backgroundColor = "#00a6ed";
  upBtn.style.border = "none";
  upBtn.style.borderRadius = "10px 10px 0 0";
  upBtn.style.textAlign = "center";
  upBtn.style.fontSize = "1.2vw";
  upBtn.style.width = "fit-content";
  upBtn.style.minWidth = "2.6vw";
  upBtn.style.height = "fit-content";
  upBtn.style.padding = "5px";
  upBtn.style.margin = "auto";

  downBtn.innerText = "🢃";
  downBtn.title = "Scroll Down";
  downBtn.style.backgroundColor = "#00a6ed";
  downBtn.style.border = "none";
  downBtn.style.borderRadius = "0 0 10px 10px";
  downBtn.style.textAlign = "center";
  downBtn.style.fontSize = "1.2vw";
  downBtn.style.width = "fit-content";
  downBtn.style.minWidth = "2.6vw";
  downBtn.style.height = "fit-content";
  downBtn.style.padding = "5px";
  downBtn.style.margin = "auto";

  // Counter
  counter.style = `
  background-color: #111827;
  color: white;
  padding: 6px 12px;
  min-width: 70px;
  border-radius: 6px;
  text-align: center;
  font-size: .7vw;
  font-family: sans-serif;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  white-space: nowrap;
  margin: auto;`;

  // Show/Hide button
  toggleBtn.innerText = "AI Scroller";
  toggleBtn.style = `
  width: fit-content;
  padding: 5px 8px;
  background-color: #00a6ed;
  color: white;
  font-size: .6vw;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: auto;`;
  toggleBtn.title = "Show/Hide Buttons";

  browserAPI.storage.local.get('scrollerVisibility', (result) => {
    scrollerButtonDiv.style.display = result.scrollerVisibility || 'flex';
  });

  bookmarkViewer.style = `
  height: fit-content;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin: auto;
  margin-top: 20px;`;

  // Append buttons in the desired order
  scrollerButtonDiv.appendChild(firstBtn);
  scrollerButtonDiv.appendChild(upBtn);
  scrollerButtonDiv.appendChild(counter);
  scrollerButtonDiv.appendChild(downBtn);
  scrollerButtonDiv.appendChild(lastBtn);
  scrollerButtonDiv.appendChild(bookmarkViewer);

  scrollerDiv.id = "scrollerDiv";
  scrollerDiv.style = `
  position: fixed;
  width: 4vw;
  right: 2vw;
  top: 15vh;
  height: fit-content;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 25px;
  margin: auto;`;

  scrollerDiv.appendChild(toggleBtn);
  scrollerDiv.appendChild(scrollerButtonDiv);

  if (document.getElementById("scrollerDiv"))
    document.getElementById("scrollerDiv").remove();

  document.body.appendChild(scrollerDiv);

  // Add hover events to show/hide first and last buttons with animation
  scrollerButtonDiv.addEventListener("mouseenter", () => {
    firstBtn.style.visibility = "visible";
    lastBtn.style.visibility = "visible";
    setTimeout(() => {
      firstBtn.style.opacity = "1";
      lastBtn.style.opacity = "1";
    }, 10);
  });
  scrollerButtonDiv.addEventListener("mouseleave", () => {
    firstBtn.style.opacity = "0";
    lastBtn.style.opacity = "0";
    setTimeout(() => {
      firstBtn.style.visibility = "hidden";
      lastBtn.style.visibility = "hidden";
    }, 300);
  });

  firstBtn.addEventListener("click", () => {
    gotoFirst();
  });
  lastBtn.addEventListener("click", () => {
    gotoLast();
  });
  upBtn.addEventListener("click", () => {
    gotoNext();
  });
  downBtn.addEventListener("click", () => {
    gotoPrev();
  });

  function gotoFirst() {
    scrolltoItem(0);
    currentIndex = 0;
  }

  function gotoLast() {
    scrolltoItem(targetDivs.length - 1);
    currentIndex = targetDivs.length - 1;
  }

  function gotoNext() {
    if (currentIndex < targetDivs.length - 1) {
      scrolltoItem(currentIndex + 1);
    }
  }

  function gotoPrev() {
    if (currentIndex > 0) {
      scrolltoItem(currentIndex - 1);
    }
  }

  // Toggle visibility of buttons and counter
  toggleBtn.addEventListener("click", () => {
    const isVisible = scrollerButtonDiv.style.display !== "none";
    const newDisplay = isVisible ? "none" : "flex";
    browserAPI.storage.local.set({ scrollerVisibility: newDisplay });
    scrollerButtonDiv.style.display = newDisplay;
  });

  function updateCounter() {
    counter.innerText = `${targetDivs.length - currentIndex} / ${targetDivs.length}`;
  }

  function scrolltoItem(index) {
    targetDivs[index].scrollIntoView({ behavior: "smooth", block: "start" });
    currentIndex = index;
    updateCounter();
  }

  bookmarksGetter();
}

function bookmarksGetter() {
  const url = window.location.href;
  browserAPI.storage.local.get('bookmarks', (result) => {
    let bookmarks = result.bookmarks || {};
    bookmarkViewer.innerHTML = "";
    const bookmarkedNumbers = bookmarks[url] || [];
    bookmarkedNumbers.forEach(number => {
      const bookmarkBtn = document.createElement("button");
      bookmarkBtn.textContent = `No. ${number}`;
      bookmarkBtn.style.width = "full";
      bookmarkBtn.style.margin = "auto";
      bookmarkBtn.style.marginTop = "5px";
      bookmarkBtn.style.padding = "5px 10px";
      bookmarkBtn.style.cursor = "pointer";
      bookmarkBtn.style.backgroundColor = "#D8586D";
      bookmarkBtn.style.color = "white";
      bookmarkBtn.style.border = "none";
      bookmarkBtn.style.borderRadius = "5px";
      bookmarkBtn.style.fontSize = ".5vw";

      bookmarkBtn.addEventListener("click", () => {
        const target = document.getElementById(`scroller-number-label${number}`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          currentIndex = targetDivs.length - number;
          counter.innerText = `${number} / ${targetDivs.length}`;
        }
      });

      bookmarkViewer.appendChild(bookmarkBtn);
    });
  });
}

function aiFun(currentUrl) {
  // Function to update the div list
  targetDivs = [...document.querySelectorAll(selector)].reverse();

  // Remove existing numbers
  document.querySelectorAll('.scroller-number-label').forEach(el => el.remove());

  // Add new numbers
  targetDivs.forEach((div, idx) => {
    const numberSpan = document.createElement('span');
    numberSpan.className = 'scroller-number-label';
    numberSpan.id = 'scroller-number-label' + (targetDivs.length - idx);
    numberSpan.innerText = `No. ${targetDivs.length - idx} `;

    numberSpan.style = `
      cursor: pointer;
      user-select: none;
      position: sticky;
      top: 0;
      margin-right: 10px;
      background: #00a6ed;
      color: white;
      font-size: 14px;
      padding: 2px 6px;
      border-radius: 6px;
      z-index: 10;
      float: right;`;
    if (currentUrl.startsWith("https://chatgpt.com/")) {
      numberSpan.style = `
      cursor: pointer;
      position: sticky;
      top: 70px;
      margin-right: 70px;
      background: #00a6ed;
      color: white;
      font-size: 14px;
      padding: 2px 6px;
      border-radius: 6px;
      z-index: 10;
      float: left;`;
    } else if (currentUrl.startsWith("https://claude.ai/chat/")) {
      numberSpan.style = `
      cursor: pointer;
      position: sticky;
      top: 10px;
      margin-right: 10px;
      background: #00a6ed;
      color: white;
      font-size: 14px;
      padding: 2px 6px;
      border-radius: 6px;
      z-index: 10;
      float: right;`;
    }

    browserAPI.storage.local.get('bookmarks', (result) => {
      let bookmarks = result.bookmarks || {};
      const current = bookmarks[currentUrl] || [];
      if (current.includes(targetDivs.length - idx)) {
        numberSpan.style.backgroundColor = "#D8586D";
      }
    });

    numberSpan.addEventListener("click", (e) => {
      numberSpan.style.backgroundColor = "#D8586D";
      e.stopPropagation();

      browserAPI.storage.local.get('bookmarks', (result) => {
        let bookmarks = result.bookmarks || {};
        const current = bookmarks[currentUrl] || [];

        if (!current.includes(targetDivs.length - idx)) {
          current.push(targetDivs.length - idx);
          showToast(`🔖 Bookmarked No. ${targetDivs.length - idx}`);
          if (current.length > 3) {
            current.shift();
          }
        } else {
          showToast(`❗${targetDivs.length - idx} Already bookmarked`);
        }

        bookmarks[currentUrl] = current;
        browserAPI.storage.local.set({ bookmarks });
        bookmarksGetter();
      });
    });

    numberSpan.addEventListener("dblclick", (e) => {
      pinMessage((targetDivs.length - idx), targetDivs[idx].textContent.slice(0, pinnedMessageLimit));
    });

    div.prepend(numberSpan);
  });

  updateCounter();

  function updateCounter() {
    counter.innerText = `${targetDivs.length - currentIndex} / ${targetDivs.length}`;
  }

  function scrolltoItem(index) {
    targetDivs[index].scrollIntoView({ behavior: "smooth", block: "start" });
    currentIndex = index;
    updateCounter();
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style = `
      position: fixed;
      top: 2vh;
      right: 2vw;
      background-color: #00a6ed;
      color: white;
      padding: 10px 14px;
      font-size: .9vw;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 0 8px rgba(0,0,0,0.2);
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }

  function pinMessage(numberofMessage, message) {
    const existing = document.querySelector('.pinned-message');
    if (existing) {
      existing.remove();
    }

    const pinedMessage = document.createElement('div');
    pinedMessage.classList.add('pinned-message');
    pinedMessage.style = `
      position: fixed;
      bottom: 7vh;
      right: 2vw;
      max-width: 20%;
      background-color: #00a6ed;
      color: white;
      padding: 10px 14px;
      font-size: .7vw;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 0 8px rgba(0,0,0,0.2);
      transition: opacity 0.3s;
    `;

    const messageText = document.createElement('div');
    messageText.innerText = `📌Pinned Message: ${message}...`;
    pinedMessage.appendChild(messageText);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.style = `
      margin-top: 10px;
      background-color: white;
      color: #00a6ed;
      border: none;
      padding: 5px 10px;
      font-size: .7vw;
      border-radius: 5px;
      cursor: pointer;
    `;

    closeBtn.addEventListener('click', () => {
      pinedMessage.style.opacity = '0';
      setTimeout(() => pinedMessage.remove(), 300);
    });

    const sourceBtn = document.createElement('button');
    sourceBtn.innerText = `Goto No. ${numberofMessage}`;
    sourceBtn.style = `
      background-color: white;
      color: #00a6ed;
      border: none;
      padding: 5px 10px;
      font-size: .7vw;
      border-radius: 5px;
      margin-left: 15px;
      cursor: pointer;
      flex: 1;
    `;
    sourceBtn.addEventListener('click', () => {
      scrolltoItem((targetDivs.length - numberofMessage));
      currentIndex = numberofMessage;
    });

    pinedMessage.appendChild(closeBtn);
    pinedMessage.appendChild(sourceBtn);

    document.body.appendChild(pinedMessage);
  }
}

// Check if extension is enabled
browserAPI.storage.local.get('aiscroller_enabled', function(result) {
  if (result.aiscroller_enabled === undefined) {
    browserAPI.storage.local.set({ aiscroller_enabled: true });
    aiscroller_enabled = true;
  } else {
    aiscroller_enabled = result.aiscroller_enabled !== false;
  }
  if (!aiscroller_enabled) {
    console.log('AI Scroller extension is disabled.');
    return;
  }
  urlCheck();
  window.addEventListener('popstate', () => setTimeout(urlCheck, 1000));
  window.addEventListener('hashchange', () => setTimeout(urlCheck, 1000));
});