/*
 Handles all the javascript for collating history
 */

document.addEventListener('DOMContentLoaded', () => {
	console.log("Getting keys")
	await GetHistory();
});

async function GetHistory() {
	const keyList = await chrome.storage.local.getKeys();
	console.log(keyList);
}
