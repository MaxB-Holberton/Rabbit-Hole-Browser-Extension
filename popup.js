/*
	Controls the javascript documentation on the popup page
*/
let offscreenPromise;
document.addEventListener('DOMContentLoaded', function () {
	/*
	 * we'll want a start/end
	 */
	document.getElementById("RabbitHole_Record").addEventListener('click', () => {
		createRemoveDocument('offscreen.html');
	});

	document.getElementById("RabbitHole_Index").addEventListener('click', () => {
		chrome.tabs.create({'url': chrome.runtime.getURL('index.html')});
	});
});

async function createRemoveDocument(path) {
	// Check all windows controlled by the service worker to see if one
	// of them is the offscreen document with the given path
	const offscreenUrl = chrome.runtime.getURL(path);
	const existingContexts = await chrome.runtime.getContexts({
		contextTypes: ['OFFSCREEN_DOCUMENT'],
		documentUrls: [offscreenUrl]
	});

	if (existingContexts.length > 0) {
		console.log("Stopping");
		chrome.offscreen.closeDocument();
		return;
	}

	// create offscreen document
	if (offscreenPromise) {
		await offscreenPromise;
	} else {
		console.log("Starting");
		offscreenPromise = chrome.offscreen.createDocument({
			url: path,
			reasons: ['WORKERS'],
			justification: 'Creating History Worker',
		});
		await offscreenPromise;
		offscreenPromise = null;
	}
}
/*
 * chrome.action.onClicked.addListener(function(tab) {
 *	chrome.tabs.create({'url': chrome.runtime.getURL('index.html')},
 *	function(tab) {
 *		// Tab opened.
 *	});
 * });
 */

