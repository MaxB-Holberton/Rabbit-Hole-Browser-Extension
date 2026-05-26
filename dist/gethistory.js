(() => {
  // src/gethistory.js
  chrome.tabs.onCreated.addListener(function(res) {
    console.log(res);
  });
})();
