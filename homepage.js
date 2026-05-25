/*
 Handles all the javascript for collating history
 */

document.addEventListener('DOMContentLoaded', async () => {
	console.log("Getting keys")
	await GetHistory();
});

async function GetHistory() {
	const keyList = await chrome.storage.local.getKeys();

	const ul = document.createElement("ul");
	keyList.forEach(async (key) => {
		if (key.includes("_session_"))
		{
			const sessionItems = await chrome.storage.local.get(key);
			const li = document.createElement("li");
			li.innerHTML = key;
			li.appendChild(expandKeys(sessionItems, key))
			ul.appendChild(li);

		}
	});
	document.getElementById("key_list").appendChild(ul);
}

function expandKeys(sessionItems, key) {
	const session_div = document.createElement("div");
	const ul = document.createElement("ul");

	sessionItems[key].forEach(item => {
		const li = document.createElement("li");
		li.innerHTML = item['title'];
		ul.appendChild(li);
	});
	session_div.appendChild(ul);
	return session_div;
}
