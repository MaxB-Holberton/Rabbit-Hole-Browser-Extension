document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("RabbitHole_Btn").addEventListener('click', () => {
		chrome.tabs.create({'url': chrome.runtime.getURL('index.html')});
	});
});
/*
 * chrome.action.onClicked.addListener(function(tab) {
 *	chrome.tabs.create({'url': chrome.runtime.getURL('index.html')},
 *	function(tab) {
 *		// Tab opened.
 *	});
 * });
 */
