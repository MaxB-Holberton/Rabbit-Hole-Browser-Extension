/*
	Controls the javascript documentation on the popup page
*/
document.addEventListener('DOMContentLoaded', function () {
	/*
	 * we'll want a start/end
	 */
	document.getElementById("RabbitHole_Record").addEventListener('click', async () => {
		startTimer();
	});

	document.getElementById("RabbitHole_Index").addEventListener('click', () => {
		chrome.tabs.create({'url': chrome.runtime.getURL('index.html')});
	});
});

async function startTimer() {
	const data = await chrome.storage.session.get(["rabbit_hole_startTime"]);
	const startTime = data.rabbit_hole_startTime;
	if (startTime)
	{
		console.log("history getting");
		const history = await chrome.history.search(
			{
				text: "",
				startTime:startTime,
			});
		await chrome.storage.session.remove(["rabbit_hole_startTime"]);
	}
	else {
		await chrome.storage.session.set({rabbit_hole_startTime: Date.now()});
	}
}
