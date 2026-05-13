/*
 The background worker for collecting the history
 */
chrome.history.onVisited.addListener(function (res) {
	console.log("------ getting history -----");
	console.log(res.id);
});
