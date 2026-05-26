/*
 The background worker for collecting the history
 Every site should write into storage
 */
/*
chrome.history.onVisited.addListener(function (res) {
  console.log("------ getting history -----");
  console.log(res);
});
*/
chrome.tabs.onCreated.addListener(function (res) {
  console.log(res);
});
