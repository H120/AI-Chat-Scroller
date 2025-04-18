setTimeout(() => {
    (function () {
      console.log("Scroller script started.");
        const currentUrl = window.location.href;
        const validUrls = ["https://chatgpt.com/", "https://grok.com/chat/", "https://claude.ai/chat/"];
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
            }
          
            targetDivs = [...document.querySelectorAll(selector)].reverse();
          
            // Remove existing numbers
            document.querySelectorAll('.scroller-number-label').forEach(el => el.remove());
          
            // Add new numbers
            targetDivs.forEach((div, idx) => {
              const numberSpan = document.createElement('span');
              numberSpan.className = 'scroller-number-label';
              numberSpan.innerText = `No. ${targetDivs.length - idx}`;
              numberSpan.style.display= localStorage.getItem('scrollerVisibility');
              numberSpan.style = `
                position: sticky;
                top: 0;
                margin-right: 10px;
                background: #2563eb;
                color: white;
                font-size: 14px;
                padding: 2px 6px;
                border-radius: 6px;
                z-index: 10;
                float: right;`;
              if (currentUrl.startsWith("https://chatgpt.com/")) {
                numberSpan.style = `
                position: sticky;
                top: 70px;
                margin-right: 70px;
                background: #2563eb;
                color: white;
                font-size: 14px;
                padding: 2px 6px;
                border-radius: 6px;
                z-index: 10;
                float: right;`;
              }else if(currentUrl.startsWith("https://claude.ai/chat/")){
                numberSpan.style = `
                position: sticky;
                top: 10px;
                margin-right: 10px;
                background: #2563eb;
                color: white;
                font-size: 14px;
                padding: 2px 6px;
                border-radius: 6px;
                z-index: 10;
                float: right;`;
              }
              div.prepend(numberSpan);
            });
          
         
            // Show/hide UI
            
            const showUI = targetDivs.length > 0;
            upBtn.style.display = localStorage.getItem('scrollerVisibility');
            downBtn.style.display = localStorage.getItem('scrollerVisibility');
            counter.style.display = localStorage.getItem('scrollerVisibility');
            // toggleBtn.style.display = block;
          
            updateCounter();
          }
          
          const btnStyle = `
            position: fixed;
            right: 20px;
            z-index: 9999;
            padding: 1px;
            background-color: #2563eb;
            color: white;
            font-size: 28px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);`;
          
          // Scroll buttons
          const upBtn = document.createElement('button');
            upBtn.innerText = "⬆️";
            upBtn.title = "Scroll Up";
            upBtn.style.backgroundColor = "#00a6ed";
            upBtn.style.border= "none";
            upBtn.style.borderRadius= "10px 10px 0 0";
            upBtn.style.textAlign = "center";
            upBtn.style.fontSize = "32px";
            upBtn.style.width = "fit-content";
            upBtn.style.height = "fit-content";
            upBtn.style.padding = "0px";
            upBtn.style.margin = "auto";

          const downBtn = document.createElement('button');
            downBtn.innerText = "⬇️";
            downBtn.title = "Scroll Down";
            downBtn.style.backgroundColor = "#00a6ed";
            downBtn.style.border= "none";
            downBtn.style.borderRadius= "0 0 10px 10px";
            downBtn.style.textAlign = "center";
            downBtn.style.fontSize = "32px";
            downBtn.style.width = "fit-content";
            downBtn.style.height = "fit-content";
            downBtn.style.padding = "0px";
            downBtn.style.margin = "auto";
          
          // Counter
          const counter = document.createElement('div');
            counter.style = `
            background-color: #111827;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            text-align: center;
            font-size: 16px;
            font-family: sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);`;
            
          // Show/Hide button
          const toggleBtn = document.createElement('button');
            toggleBtn.innerText = "AI Scroller";
            toggleBtn.style = `
            width: fit-content;
            padding: 5px 8px; 
            background-color: #2563eb;
            color: white;
            font-size: 12px;
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
          scrollerButtonDiv.appendChild(upBtn);
          scrollerButtonDiv.appendChild(counter);
          scrollerButtonDiv.appendChild(downBtn);
          
          const scrollerDiv = document.createElement('div');
            scrollerDiv.style = `
            position: fixed;
            right: 20px;
            top: 200px;
            height: fit-content;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: space-between;
            gap: 10px;`;
          
          scrollerDiv.appendChild(toggleBtn);
          scrollerDiv.appendChild(scrollerButtonDiv);
          
          document.body.appendChild(scrollerDiv);
        let currentIndex = 0;

        function updateCounter() {
            counter.innerText = `${targetDivs.length - currentIndex} / ${targetDivs.length}`;
        }

        function scrollTo(index) {
            targetDivs[index].scrollIntoView({ behavior: "smooth", block: "start" });
            currentIndex = index;
            updateCounter();
        }

        upBtn.addEventListener("click", () => {
            if (currentIndex < targetDivs.length - 1) {
                scrollTo(currentIndex + 1);
            }
        });

        downBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                scrollTo(currentIndex - 1);
            }
        });

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
        }, 3000); // Check every 1 second
        
    })();
}, 5000); // Wait 5 seconds before running the script
