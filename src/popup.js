import makeTag from "./maketag.js";
import { RabbitHoleMetadata, GetBlacklist } from "./history.js";
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
  console.log("UI DATA READY:", enriched);
  // render(enriched); YOUR DOM RENDERING GOES IN HERE
}
// rabbit gif changes based on session state
function setIndexButtonIcon(isRecording) {
  const indexIcon = document.getElementById("RabbitHole_Index_Icon");

  if (!indexIcon) {
    return;
  }

  indexIcon.src = isRecording ? "assets/dig_transparent.gif" : "assets/spiraleyerabbit_40ms.gif";
}

// start & stop icons change based on button state
function setRecordButtonIcon(isRecording) {
  const recordIcon = document.getElementById("RabbitHole_Record_Icon");

  if (!recordIcon) {
    return;
  }

  recordIcon.src = isRecording ? "assets/stop_icon.svg" : "assets/start_icon.svg";
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
  chrome.storage.session.get(["rabbit_hole_startTime"]).then(({ rabbit_hole_startTime }) => {
    const isRecording = Boolean(rabbit_hole_startTime);

    setRecordButtonIcon(isRecording);
    setIndexButtonIcon(isRecording);
  });

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

async function StripBlacklistedItems(start_time) {
  const stripped_data = [];
  const active_items = [];
  const history = await chrome.history.search({
    text: "",
    startTime: start_time,
  });

  if (history.length === 0) {
    return ([]);//return a 0 length array
  }

  const blacklist_data = await GetBlacklist();
  if (blacklist_data === undefined)
  {
    return history;
  }

  for (const active_item of blacklist_data) {
    if (active_item.active)
    {
      active_items.unshift(active_item.name);
      continue;
    }
  }

  for (const item of history) {
    const url = new URL(item.url);
    const url_host = url.hostname.toString().replace("www.", "").toLowerCase();
    console.log(url_host);
    let match_lock = false;
    for (blacklist of active_items) {
      //for each item in the list of active blacklist items.
      if (url_host.includes(blacklist.toLowerCase())) {
        //on match ->  3
        console.log("Match");
        match_lock = true;
        break;
      }
    }
    if(match_lock)
    {
      continue;
    }
    //no match -> write to the data
    console.log("No Match");
    stripped_data.unshift(item);
  };
  console.log(stripped_data);

  return stripped_data;
}

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
      setRecordButtonIcon(true);
      setIndexButtonIcon(true);
      return;
    }
    // Any button changes for RabbitHole_Record should happen here
    // If possible - lock the button while this is running until it is finished

    await chrome.storage.session.remove(["rabbit_hole_startTime"]);
    setRecordButtonIcon(false);
    setIndexButtonIcon(false);
    const end_time = Date.now();

    const history = await StripBlacklistedItems(start_time);

    if (history.length === 0) {
      console.log("No history found, skipping session save");
      return;
    }

    console.log("HISTORY:", history);
    const taggedHistory = [];
    for (const entry of history) {
      const taggedEntry = await makeTag(entry);
      taggedHistory.push(taggedEntry);
    }

    const new_session = RabbitHoleMetadata(taggedHistory, start_time, end_time);
    await chrome.storage.local.set(new_session);

    // Initial render that's totally optional
    await refreshUI(taggedHistory);

    // If possible - unlock the button here so user knows their session has been saved
    // add some form of notification for the user to know their session was successful/unsuccessful
  } catch (error) {
    console.error("TOGGLETIMER ERROR:", error);
  }
}
