chrome.history.onVisited.addListener(() => {
    chrome.storage.local.set({ rabbit_hole_lastActive: Date.now() });
});