/*
 The background worker for collecting the history
 Every site should write into storage
 */
chrome.history.onVisited.addListener(function (res) {
	console.log("------ getting history -----");
	console.log(res);
	//await setHistory(res);  "background": {"service_worker": "gethistory.js"},

});

async function setHistory(res){
	await chrome.storage.local.set({res.id: res});
}
