import makeTag from "./maketag.js";
import { RabbitHoleMetadata } from "./history.js";

/*
 * Controls the javascript documentation on the popup page
 */
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("RabbitHole_Record").addEventListener('click', async () => {
    /* start/stop the timer for when a rabbit hole is created */
    ToggleTimer();
  });

  document.getElementById("RabbitHole_Index").addEventListener('click', () => {
    /**/
    chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html') });
  });
});

async function ToggleTimer() {
  const data = await chrome.storage.session.get(["rabbit_hole_startTime"]);
  const start_time = data.rabbit_hole_startTime;
  if (!start_time) {
    await chrome.storage.session.set({ rabbit_hole_startTime: Date.now() });
    return;
  }

  await chrome.storage.session.remove(["rabbit_hole_startTime"]);
  const end_time = Date.now();

  const history = await chrome.history.search({
      text: "",
      startTime: start_time,
    });

  const taggedHistory = [];
  for (const entry of history) {
    const taggedEntry = await makeTag(entry);
    taggedHistory.push(taggedEntry);
  }
  const new_session = RabbitHoleMetadata(taggedHistory, start_time, end_time);

  await chrome.storage.local.set(new_session);
}


