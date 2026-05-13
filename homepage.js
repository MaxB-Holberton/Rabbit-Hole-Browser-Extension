/*
 Handles all the javascript for collating history
 */
document.addEventListener('DOMContentLoaded', function () {
	const keyList = await chrome.storage.local.getKeys();
	console.log(keyList);
});

