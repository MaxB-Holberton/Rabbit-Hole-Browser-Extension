import makeTag from "./maketag.js";
import { RabbitHoleMetadata } from "./history.js";
import { getManualTags, addManualTag, getPageId } from "./tagStore";

//====================
// UI RENDER HELPERS |
//====================

async function enrichHistory(history) {
  const manualTags = await getManualTags();

  return history.map(entry => {
    const pageId = getPageId(entry.url);

    return {
      ...entry,
      manualTags: manualTags[pageId] ?? []
    };
  });
}

async function refreshUI(history) {
  const enriched = await enrichHistory(history);
  console.log("RENDER:", enriched);
  // render(enriched); YOUR DOM RENDERING GOES IN HERE
}

//===============
// USER TAGGING |
//===============

async function onAddTag(historyEntry, tag, currentHistory) {
  const pageId = getPageId(historyEntry.url);

  await addManualTag(pageId, tag);

  //re-render after update
  await refreshUI(currentHistory);
}

//=============
// DOM EVENTS |
//=============

/*
 * Controls the javascript documentation on the popup page
 */
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("RabbitHole_Record").addEventListener('click', async () => {
    /* start/stop the timer for when a rabbit hole is created */
    console.log("BUT:TON PRESSED");
    ToggleTimer();
    console.log("FUNCTION FINISHED");
  });

  document.getElementById("RabbitHole_Index").addEventListener('click', () => {
    /**/
    chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html') });
  });
});

//===================
// SESSION CREATION |
//===================

async function ToggleTimer() {
  try {
    console.log("ToggleTimer FIRED");

    const data = await chrome.storage.session.get(["rabbit_hole_startTime"]);
    const start_time = data.rabbit_hole_startTime;

    console.log("Session data:", data);

    if (!start_time) {
      console.log("Starting timer");

      await chrome.storage.session.set({ rabbit_hole_startTime: Date.now() });
      return;
    }
    // Any button changes for RabbitHole_Record should happen here
    // If possible - lock the button while this is running until it is finished

    await chrome.storage.session.remove(["rabbit_hole_startTime"]);
    const end_time = Date.now();

    const history = await chrome.history.search({
      text: "",
      startTime: start_time,
    });

    console.log("HISTORY:", history);
    const taggedHistory = [];
    for (const entry of history) {
      const taggedEntry = await makeTag(entry);
      taggedHistory.push(taggedEntry);
    }
    //Empty list check
    if (taggedHistory.length === 0) {
      console.log("No history found, skipping session save");
      return;
    }
    const new_session = RabbitHoleMetadata(taggedHistory, start_time, end_time);
    await chrome.storage.local.set(new_session);

    // If possible - unlock the button here so user knows their session has been saved
    // add some form of notification for the user to know their session was successful/unsuccessful

  } catch (error) {
    console.error("TOGGLETIMER ERROR:", error);
  }

}


