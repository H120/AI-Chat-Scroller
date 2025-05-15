setTimeout(() => {
  const doubleClickDuration= 300;

    (function () {
      let currentIndex = 0;

      console.log("Scroller script started.");

      const currentUrl = window.location.href;
      const validUrls = [
        "https://chatgpt.com/",
        "https://grok.com/chat/",
        "https://claude.ai/chat/",
        "https://copilot.microsoft.com/chats/"
      ];
      if (!validUrls.some(url => currentUrl.startsWith(url))) {
        console.log("Scroller script disabled: not a valid URL.");
        return;
      }

      let targetDivs = [];
      let selector = '';

      // Function to update the div list
      function updateDivs() {
          targetDivs = [];
        
          if (currentUrl.startsWith("https://chatgpt.com/c/")) {
            selector = "article.text-token-text-primary.w-full";
          } else if (currentUrl.startsWith("https://grok.com/chat/")) {
            selector = ".relative.group.flex.flex-col.justify-center.w-full.max-w-3xl";
          } else if (currentUrl.startsWith("https://claude.ai/chat/")) {
            selector = "div[data-test-render-count]";
          } else if (currentUrl.startsWith("https://copilot.microsoft.com/chats/")) {
            selector = 'div[data-tabster="{&quot;groupper&quot;:{&quot;tabbability&quot;:2},&quot;focusable&quot;:{}}"], div[data-tabster]';
          }            
        
          targetDivs = [...document.querySelectorAll(selector)].reverse();
        
          // Remove existing numbers
          document.querySelectorAll('.scroller-number-label').forEach(el => el.remove());
        
          // Add new numbers
          targetDivs.forEach((div, idx) => {
            const numberSpan = document.createElement('span');
            numberSpan.className = 'scroller-number-label';
            numberSpan.id = 'scroller-number-label'+(targetDivs.length - idx);
            numberSpan.innerText = `No. ${targetDivs.length - idx}`;
            
            const url = window.location.href;
            const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
            const current = bookmarks[url] || [];
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
                  currentIndex = targetDivs.length-number;
                  counter.innerText = `${number} / ${targetDivs.length}`;
                }
              });
              
              bookmarkViewer.innerHTML="";
              bookmarkViewer.appendChild(bookmarkBtn);
            });
            numberSpan.style.display= localStorage.getItem('scrollerVisibility');
            numberSpan.style = `
              cursor: pointer;
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
            }else if(currentUrl.startsWith("https://claude.ai/chat/")){
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

            // If already bookmarked, set orange background
            if (current.includes(targetDivs.length - idx)) {
              numberSpan.style.backgroundColor = "#D8586D";
            }
            // ✅ Add click listener only to the label
            numberSpan.addEventListener("click", (e) => {
              clickTimeout = setTimeout(() => {
                console.log("Checking Double Click");

              numberSpan.style.backgroundColor = "#D8586D";

              e.stopPropagation(); // prevent bubbling
            
              const url = window.location.href;
              let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
            
              // Get current list for this URL, or empty array
              const current = bookmarks[url] || [];
            
              if (!current.includes(targetDivs.length - idx)) {
                // Add the number, keeping only last 3
                current.push(targetDivs.length - idx);
                showToast(`🔖 Bookmarked No. ${targetDivs.length - idx}`);
                if (current.length > 3) {
                  current.shift(); // remove the oldest
                }
              }else{
                showToast(`❗${targetDivs.length - idx} Already bookmarked`);
              }
            
              bookmarks[url] = current;
              localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            }, doubleClickDuration);
            });
            numberSpan.addEventListener("dblclick", (e) => {
              clearTimeout(clickTimeout);
              pinMessage("OK")
            });
            div.prepend(numberSpan);
          });

          upBtn.style.display = localStorage.getItem('scrollerVisibility');
          downBtn.style.display = localStorage.getItem('scrollerVisibility');
          counter.style.display = localStorage.getItem('scrollerVisibility');
          bookmarkViewer.style.display = localStorage.getItem('scrollerVisibility');
          // toggleBtn.style.display = block;
          updateCounter();
        }
          
        // Scroll buttons
        const upBtn = document.createElement('button');
          upBtn.innerText = "⬆️";
          upBtn.title = "Scroll Up";
          upBtn.style.backgroundColor = "#00a6ed";
          upBtn.style.border= "none";
          upBtn.style.borderRadius= "10px 10px 0 0";
          upBtn.style.textAlign = "center";
          upBtn.style.fontSize = "1.2vw";
          upBtn.style.width = "fit-content";
          upBtn.style.height = "fit-content";
          upBtn.style.padding = "5px";
          upBtn.style.margin = "auto";

        const downBtn = document.createElement('button');
          downBtn.innerText = "⬇️";
          downBtn.title = "Scroll Down";
          downBtn.style.backgroundColor = "#00a6ed";
          downBtn.style.border= "none";
          downBtn.style.borderRadius= "0 0 10px 10px";
          downBtn.style.textAlign = "center";
          downBtn.style.fontSize = "1.2vw";
          downBtn.style.width = "fit-content";
          downBtn.style.height = "fit-content";
          downBtn.style.padding = "5px";
          downBtn.style.margin = "auto";
        
        // Counter
        const counter = document.createElement('div');
          counter.style = `
          background-color: #111827;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          text-align: center;
          font-size: .7vw;
          font-family: sans-serif;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          white-space: nowrap;`;

        // Show/Hide button
        const toggleBtn = document.createElement('button');
          toggleBtn.innerText = "AI Scroller";
          toggleBtn.style = `
          width: fit-content;
          padding: 5px 8px;
          background-color: #00a6ed;
          color: white;
          font-size: .6vw;
          border: none;
          border-radius: 8px;
          cursor: pointer;`;
          toggleBtn.title = "Show/Hide Buttons";
        
        const scrollerButtonDiv = document.createElement('div');
          scrollerButtonDiv.style = `
          height: fit-content;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;`;
        const bookmarkViewer = document.createElement('div');
        bookmarkViewer.style = `
          height: fit-content;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          margin-top: 10px;
          margin: auto;`;
        scrollerButtonDiv.appendChild(upBtn);
        scrollerButtonDiv.appendChild(counter);
        scrollerButtonDiv.appendChild(downBtn);
        scrollerButtonDiv.appendChild(bookmarkViewer);
        
        const scrollerDiv = document.createElement('div');
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
          gap: 10px;
          margin: auto;`;
        
        scrollerDiv.appendChild(toggleBtn);
        scrollerDiv.appendChild(scrollerButtonDiv);
        
        document.body.appendChild(scrollerDiv);

        function updateCounter() {
            counter.innerText = `${targetDivs.length - currentIndex} / ${targetDivs.length}`;
        }

        function scrollTo(index) {
            targetDivs[index].scrollIntoView({ behavior: "smooth", block: "start" });
            currentIndex = index;
            updateCounter();
        }

        upBtn.addEventListener("click", () => {
          clickTimeout = setTimeout(() => {
            console.log("Checking Double Click"); 
            gotoNext();
          }, doubleClickDuration);
        });
        upBtn.addEventListener("dblclick", () => {
          clickTimeout = setTimeout(() => {
            console.log("Checking Double Click");
            gotoFirst();
          }, doubleClickDuration);
        });
        function gotoFirst(){
          scrollTo(targetDivs.length - 1);
          currentIndex= targetDivs.length - 1;
        }
        function gotoNext(){
          if (currentIndex < targetDivs.length - 1) {
            scrollTo(currentIndex + 1);
          }
        }

        downBtn.addEventListener("click", () => {
          clickTimeout = setTimeout(() => {
            console.log("Checking Double Click");
            gotoPrev();
          }, doubleClickDuration);
        });
        downBtn.addEventListener("dblclick", () => {
          clearTimeout(clickTimeout);
          gotoLast();
        });
        function gotoLast(){
          scrollTo(0);
          currentIndex= 0;
        }
        function gotoPrev(){
          if (currentIndex > 0) {
            scrollTo(currentIndex - 1);
          }
        }
        // Toggle visibility of buttons and counter
        toggleBtn.addEventListener("click", () => {
          const isVisible = upBtn.style.display !== "none";
          const newDisplay = isVisible ? "none" : "block";
          localStorage.setItem('scrollerVisibility', newDisplay);
          upBtn.style.display = newDisplay;
          downBtn.style.display = newDisplay;
          counter.style.display = newDisplay;
        });

        // Initial div update
        updateDivs();

        // Set an interval to update the div list every 5 seconds
        setInterval(updateDivs, 5000);
        let previousUrl = window.location.href;

        setInterval(() => {
          const newUrl = window.location.href;
          if (newUrl !== previousUrl) {
            previousUrl = newUrl;
            currentIndex = 0;
            updateDivs(); // Refresh the list
            updateCounter(); // Reset counter display
          }
        }, 3000); // Check every 3 second
        
    })();

    function showToast(message) {
      const toast = document.createElement('div');
      toast.innerText = message;
      toast.style = `
        position: fixed;
        bottom: 5vh;
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

    function pinMessage(message) {
      const toast = document.createElement('div');
      toast.innerText = message;
      toast.style = `
        position: fixed;
        top: 5vh;
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
      // setTimeout(() => {
      //   toast.style.opacity = '0';
      //   setTimeout(() => toast.remove(), 500);
      // }, 2000);
    }
    // document.addEventListener(
    //   "keyup",
    //   (event) => {
    //     const keyName = event.key;

    //     if (keyName === ".") {
    //       gotoNext();
    //     }
    //     if (keyName === ",") {
    //       gotoPrev();
    //     }
        
    //   },
    //   false,
    // );
}, 5000); // Wait 5 seconds before running the script
