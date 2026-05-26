import makeTag from "./maketag.js";

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
    chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html') });
  });
});

async function startTimer() {
  const data = await chrome.storage.session.get(["rabbit_hole_startTime"]);
  const startTime = data.rabbit_hole_startTime;
  if (startTime) {
    console.log("history getting");
    const history = await chrome.history.search(
      {
        text: "",
        startTime: startTime,
      });
    console.log(history);
    await chrome.storage.session.remove(["rabbit_hole_startTime"]);
    const newSession = {};
    const rabbit_hole_name = `rabbit_hole_session_${Date.now()}`;
    newSession[rabbit_hole_name] = history;

    // Making tags here for now so we have them.
    const taggedHistory = [];

    console.log(newSession);
    for (const entry of newSession[rabbit_hole_name]) {
      const taggedEntry = await makeTag(entry);
      taggedHistory.push(taggedEntry);
    }
    newSession[rabbit_hole_name] = taggedHistory;
    await chrome.storage.local.set(newSession);
  } else {
    await chrome.storage.session.set({ rabbit_hole_startTime: Date.now() });
  }
}
