const inlineTranslateCallback = (mutations, observer) => {
    document.querySelectorAll('p,span,h2,h3,h4,h5,h6,label').forEach(p => {
        if (p.processed == 1) {
            return;
        }
        if(p.children.length > 0) {
            return;
        }
        if(!isNaN(p.textContent.replaceAll('\'',''))) {
            return; 
        }
        let parent = p.parentNode; 
        while (parent != null) {
            // Exclude dropdowns, as they break otherwise.
            if (parent.tagName == "ZHP-SELECT") {
                return;
            } 
            parent = parent.parentNode; 
        } 
        p.processed=1; 
        const dup = document.createElement('span');
        dup.textContent = ' | ' + p.textContent;
        p.textContent = p.textContent + " ";
        dup.translate=1;
        dup.processed = 1;
        p.appendChild(dup);
        p.translate=0 
    })
}

const reset = () => {
    document.querySelectorAll('p,span,h2,h3,h4,h5,h6,label').forEach(p => {
        if (p.processed != 1) {
            return;
        }
        if(!isNaN(p.textContent.replaceAll('\'',''))) {
            return; 
        }
        let parent = p.parentNode; 
        while (parent != null) {
            // Exclude dropdowns, as they break otherwise.
            if (parent.tagName == "ZHP-SELECT") {
                return;
            } 
            parent = parent.parentNode; 
        }
        if (p.children.length == 0) {
            return;
        } 
        const childSpan = p.querySelector('span');
        if (childSpan != null) {
            p.removeChild(childSpan);
        }
        p.processed=0;
        p.translate=1;
    })
}
var inlineTranslateObserver;

const start = () => {
    inlineTranslateObserver = new MutationObserver(inlineTranslateCallback)
    inlineTranslateObserver.observe(document.body, { 
        childList:true, 
        subtree:true 
    });
    document.body.translate=0;
    inlineTranslateCallback(null, null);
}

chrome.storage.local.get(["translateInline"]).then((result) => {
        const newState = result.translateInline;
        if (newState) {
            start();
        }
  });


chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key == "translateInline") {
          if (newValue) {
            start();
          } else {
              inlineTranslateObserver.disconnect();
              reset();
              document.body.translate=1;
          }
      }
  }
});
