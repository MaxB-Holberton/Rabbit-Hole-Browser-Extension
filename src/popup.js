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

//session status text helper
// normalizes string of status then map so classes added & correct CSS
function setSessionStatus(status) {
  const statusNode = document.getElementById("SessionStatusText");
  if (!statusNode) return;

  const normalized = String(status || "").trim().toLowerCase();
  const statusMap = {
    ready: { label: "Ready", className: "status-ready" },
    recording: { label: "Recording", className: "status-recording" },
    finished: { label: "Finished", className: "status-finished" },
    "error saving": { label: "Error Saving", className: "status-error" }
  };

  const nextStatus = statusMap[normalized] || statusMap.ready;
  statusNode.textContent = nextStatus.label;
  statusNode.className = nextStatus.className;
}

// TIME ELAPSED FUNCTIONS ⭒˚｡⋆ヽ(・∀・)ﾉ
// formatting for timer text for 'Timer Elapsed'
let elapsedIntervalId = null;

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  // shows hours if necessary, no hours by default, uses padStart
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// sets timer text for 'Time Elapsed'
function setElapsedText(text) {
  const elapsedThing = document.getElementById("TimeElapsedVal");
  if (!elapsedThing) return;
  elapsedThing.textContent = text;
}

//updates timer text for 'Time Elapsed'
function updateElapsed(startTime) {
  setElapsedText(formatElapsed(Date.now() - startTime));
}

//stops Elapsed clock
function stopElapsedClock(reset = true) {
  if (elapsedIntervalId != null) {
    clearInterval(elapsedIntervalId);
    elapsedIntervalId = null;
  }
  if (reset) setElapsedText("00:00");
}

//starts Elapsed clock with immediate 00:00 going
function startElapsedClock(startTime) {
  stopElapsedClock(false);
  updateElapsed(startTime);
  elapsedIntervalId = setInterval(() => updateElapsed(startTime), 1000);
}

// PAGES TRACKED FUNCTIONS ☆ ～('▽^人)

// sets text for Pages Tracked
function setPagesTrackedText(count) {
  const node = document.getElementById("PagesTrackedVal");
  if (!node) return;
  node.textContent = String(count);
}

//updates Pages Tracked 
async function updatePagesTracked(startTime) {
  const history = await chrome.history.search({
    text: "",
    startTime: startTime
  });
  const count = history.length;
  setPagesTrackedText(count);
}

// stop clock for Pages Tracked
let pagesTrackedIntervalId = null;

function stopPagesTrackedClock(reset = true) {
  if (pagesTrackedIntervalId != null) {
    clearInterval(pagesTrackedIntervalId);
    pagesTrackedIntervalId = null;
  }
  if (reset) setPagesTrackedText(0);
}

//start clock for pages tracked every 3 secs (3000)
function startPagesTrackedClock(startTime) {
  stopPagesTrackedClock(false);
  updatePagesTracked(startTime).catch(console.error);
  pagesTrackedIntervalId = setInterval(() => {
    updatePagesTracked(startTime).catch(console.error);
  }, 3000);
}

//
//===============
// USER TAGGING |
//===============

async function onAddTag(historyEntry, tag, currentHistory) {
  const pageId = getPageId(historyEntry.url);

  await addManualTag(pageId, tag);

  //re-render after update
  await refreshUI(currentHistory);
}

//===================
// SESSION CREATION |
//===================


async function ToggleTimer() {
  try {
    console.log("ToggleTimer FIRED");
    //check to see if there is a stored startTime
    const data = await chrome.storage.local.get(["rabbit_hole_startTime"]);
    const start_time = data.rabbit_hole_startTime;

    //If there is not stored start time, store the start time and update UI to show session is running
    if (!start_time) {
      console.log("Starting timer");

      const now = Date.now();
      await chrome.storage.local.set({ rabbit_hole_startTime: now, rabbit_hole_status: "recording" });
      setSessionStatus("Recording");
      setRecordButtonIcon(true);
      setIndexButtonIcon(true);
      startElapsedClock(now);
      startPagesTrackedClock(now);
      return;
    }
    //There is a start time, meaning that a session is running.
    //stop the session, update UI and store the session to local data.
    await chrome.storage.local.remove(["rabbit_hole_startTime", "rabbit_hole_lastActive"]);
    setRecordButtonIcon(false);
    setIndexButtonIcon(false);
    stopElapsedClock(true);
    stopPagesTrackedClock(true);

    await ProcessSessionData(start_time)
    setSessionStatus("Finished");

  } catch (error) {
    console.error("TOGGLETIMER ERROR:", error);
    await chrome.storage.local.set({ rabbit_hole_status: "error" });
    setSessionStatus("Error Saving");
    stopElapsedClock(true);
    stopPagesTrackedClock(true);
  }
}

async function StripBlacklistedItems(history)
{
  const stripped_data = [];
  const active_items = [];
  const blacklist_data = await GetBlacklist();
  let active_count = 0;

  if (history.length === 0)
  {
    return ([]);//return a 0 length array
  }

  if (blacklist_data === undefined)
  {
    return history;
  }

  for (const active_item of blacklist_data)
  {
    if (active_item.active)
    {
      active_count += 1;
      active_items.unshift(active_item.name);
      continue;
    }
  }

  if (active_count === 0)
  {
    //No blacklist is enabled,
    //no point running through the lists
    return history;
  }

  for (const item of history)
  {
    const url = new URL(item.url);
    const url_host = url.hostname.toString().replace("www.", "").toLowerCase();
    let match_lock = false;
    for (const blacklist of active_items)
    {
      //for each item in the list of active blacklist items.
      if (url_host.includes(blacklist.toLowerCase()))
      {
        match_lock = true;
        break;
      }
    }
    if(match_lock)
    {
      continue;
    }
    stripped_data.unshift(item);
  }

  return stripped_data;
}

async function ProcessSessionData(start_time)
{
  const end_time = Date.now();
  const taggedHistory = [];
  const history = await chrome.history.search({
    text: "",
    startTime: start_time,
  });

  if (history.length === 0)
  {
    //nothing to write so just return
    return;
  }

  const stripped_history = await StripBlacklistedItems(history);

  for (const entry of stripped_history) {
    const taggedEntry = await makeTag(entry);
    taggedHistory.push(taggedEntry);
  }
  await refreshUI(taggedHistory);

  const new_session = RabbitHoleMetadata(taggedHistory, start_time, end_time);

  await chrome.storage.local.set(new_session);
  await chrome.storage.local.set({ rabbit_hole_status: "finished" });
}

//=============
// DOM EVENTS |
//=============

/*
 * Controls the javascript documentation on the popup page
 * Changes textcontent & icon button based on session state
 */
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(["rabbit_hole_startTime", "rabbit_hole_status"],
    async ({ rabbit_hole_startTime, rabbit_hole_status}) => {
      const isRecording = Boolean(rabbit_hole_startTime);

      //STANDARD UI FLOW
      setRecordButtonIcon(isRecording);
      setIndexButtonIcon(isRecording);

      if (isRecording) {
        setSessionStatus("Recording");
        startElapsedClock(rabbit_hole_startTime);
        startPagesTrackedClock(rabbit_hole_startTime);
        return;
      } else if (rabbit_hole_status === "error") {
        setSessionStatus("Error Saving");
      } else if (rabbit_hole_status === "finished") {
        setSessionStatus("Finished");
      } else {
        setSessionStatus("Ready");
      }
      stopElapsedClock(true);
      stopPagesTrackedClock(true);
      return;
    });

  document.getElementById("RabbitHole_Record").addEventListener('click', async () => {
    /* start/stop the timer for when a rabbit hole is created */
    console.log("BUTTON PRESSED");
    ToggleTimer();
    console.log("FUNCTION FINISHED");
  });

  document.getElementById("RabbitHole_Index").addEventListener('click', () => {
    /**/
    chrome.tabs.create({ 'url': chrome.runtime.getURL('index.html') });
  });

  window.addEventListener("beforeunload", () => stopElapsedClock(false));
  window.addEventListener("beforeunload", () => stopPagesTrackedClock(false));
});

//FOR UNIT TESTING, ADD YOUR COMPONENTS HERE
export { formatElapsed, setSessionStatus, StripBlacklistedItems }