import makeTag from "./maketag.js";
import { RabbitHoleMetadata } from "./history.js";
import { getManualTags, addManualTag, getPageId } from "./tagStore";

const STALE_THRESHHOLD = 10 * 60 * 1000; //ten minutes

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
    startTime
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

//=============
// DOM EVENTS |
//=============

/*
 * Controls the javascript documentation on the popup page
Changes textcontent & icon button based on session state
 */
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(["rabbit_hole_startTime", "rabbit_hole_status", "rabbit_hole_lastActive"],
    async ({ rabbit_hole_startTime, rabbit_hole_status, rabbit_hole_lastActive }) => {

      const isRecording = Boolean(rabbit_hole_startTime);

      //STALE DETECTION
      const now = Date.now();
      const isStale =
        rabbit_hole_lastActive &&
        now - rabbit_hole_lastActive > STALE_THRESHHOLD;

      //AUTO FINALIZE IF STALE SESSION
      if (isRecording && isStale) {
        console.log("Stale session detected -> Auto Finalizing");

        await finalizeStaleSession({
          startTime: rabbit_hole_startTime
        });

        setSessionStatus("Finished");
        stopElapsedClock(true);
        stopPagesTrackedClock(true);
        return;
      }

      //STANDARD UI FLOW
      setRecordButtonIcon(isRecording);
      setIndexButtonIcon(isRecording);

      if (isRecording) {
        setSessionStatus("Recording");
        startElapsedClock(rabbit_hole_startTime);
        startPagesTrackedClock(rabbit_hole_startTime);
      } else if (rabbit_hole_status === "error") {
        setSessionStatus("Error Saving");
        stopElapsedClock(true);
        stopPagesTrackedClock(true);
      } else if (rabbit_hole_status === "finished") {
        setSessionStatus("Finished");
        stopElapsedClock(true);
        stopPagesTrackedClock(true);
      } else {
        setSessionStatus("Ready");
        stopElapsedClock(true);
        stopPagesTrackedClock(true);
      }
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

  window.addEventListener("beforeunload", () => stopElapsedClock(false));
  window.addEventListener("beforeunload", () => stopPagesTrackedClock(false));
});

//===================
// SESSION CREATION |
//===================


//CLEANUP CREW FOR STALE SESSIONS
async function finalizeStaleSession({ startTime }) {
  const end_time = Date.now();

  const history = await chrome.history.search({
    text: "",
    startTime
  });

  const taggedHistory = [];
  for (const entry of history) {
    taggedHistory.push(await makeTag(entry));
  }

  if (taggedHistory.length === 0) {
    await chrome.storage.local.set({ rabbit_hole_status: "ready" });
    return;
  }

  const session = RabbitHoleMetadata(taggedHistory, startTime, end_time);

  try {
    await chrome.storage.local.set(session);
    await chrome.storage.local.set({ rabbit_hole_status: "finished" });
  } catch (err) {
    console.error(err);
    await chrome.storage.local.set({ rabbit_hole_status: "error" });
  }
}

async function ToggleTimer() {
  try {
    console.log("ToggleTimer FIRED");

    const data = await chrome.storage.local.get(["rabbit_hole_startTime"]);
    const start_time = data.rabbit_hole_startTime;

    console.log("Session data:", data);

    if (!start_time) {
      console.log("Starting timer");

      const now = Date.now();
      await chrome.storage.local.set({ rabbit_hole_startTime: now, rabbit_hole_status: "recording", rabbit_hole_lastActive: now });
      setSessionStatus("Recording");
      setRecordButtonIcon(true);
      setIndexButtonIcon(true);
      startElapsedClock(now);
      startPagesTrackedClock(now);
      return;
    }
    // Any button changes for RabbitHole_Record should happen here
    await chrome.storage.local.remove(["rabbit_hole_startTime", "rabbit_hole_status", "rabbit_hole_lastActive"]);
    setRecordButtonIcon(false);
    setIndexButtonIcon(false);
    stopElapsedClock(true);
    stopPagesTrackedClock(true);
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
      await chrome.storage.local.set({ rabbit_hole_status: "ready" });
      setSessionStatus("Ready");
      stopElapsedClock(true);
      stopPagesTrackedClock(true);
      return;
    }

    const new_session = RabbitHoleMetadata(taggedHistory, start_time, end_time);

    try {
      await chrome.storage.local.set(new_session);
      await chrome.storage.local.set({ rabbit_hole_status: "finished" });
      setSessionStatus("Finished");
    } catch (saveError) {
      console.error("Session save error:", saveError);
      await chrome.storage.local.set({ rabbit_hole_status: "error" });
      setSessionStatus("Error Saving");
      stopElapsedClock(true);
      stopPagesTrackedClock(true);
      return;
    }

    // Initial render that's totally optional
    await refreshUI(taggedHistory);


  } catch (error) {
    console.error("TOGGLETIMER ERROR:", error);
    await chrome.storage.local.set({ rabbit_hole_status: "error" });
    setSessionStatus("Error Saving");
    stopElapsedClock(true);
    stopPagesTrackedClock(true);
  }
}
