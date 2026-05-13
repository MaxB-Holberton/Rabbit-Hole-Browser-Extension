chrome.history.onVisited.addListener(function (res) {
	console.log("------ getting history -----");
	console.log(res.id);
});
