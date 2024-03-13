chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(["translateInline"]).then((result) => {
        const newState = !result.translateInline;
        chrome.storage.local.set({ translateInline: newState });
        chrome.action.setBadgeText( {text: (newState ? "on" : "off")} )
  });
});

chrome.storage.local.get(["translateInline"]).then((result) => {
    chrome.action.setBadgeText( {text: (result.translateInline)? "on" : "off"} )
});