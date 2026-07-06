import { ProcessSessionData } from "./session.js";
import { GetStaleThresholdMinutes, ScheduleStaleCheckAlarm } from "./history.js";

const AWAY_BUFFER = 1 * 60 * 1000; // Grace period after "are you still there?" before autosave

// Update lastActive on new page visit
chrome.history.onVisited.addListener(() => {
  chrome.storage.local.set({ rabbit_hole_lastActive: Date.now() });
});

// Update lastActive on tab switch
chrome.tabs.onActivated.addListener(() => {
  chrome.storage.local.set({ rabbit_hole_lastActive: Date.now() });
});

// Check period is derived from the user's stale threshold setting;
// re-registered here on every service worker startup so it's always
// in sync even if storage changed while the worker was asleep.
ScheduleStaleCheckAlarm();

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm fired:", alarm.name);
  if (alarm.name === "staleCheck") {
    checkStale();
  }
});

async function checkStale() {
  console.log("checkStale running");
  const data = await chrome.storage.local.get([
    "rabbit_hole_startTime",
    "rabbit_hole_lastActive"
  ]);
  console.log("storage data:", data);

  const { rabbit_hole_startTime, rabbit_hole_lastActive } = data;

  // No active session, nothing to do
  if (!rabbit_hole_startTime) return;

  const staleThresholdMinutes = await GetStaleThresholdMinutes();
  const STALE_THRESHOLD = staleThresholdMinutes * 60 * 1000;
  const AWAY_THRESHOLD = STALE_THRESHOLD + AWAY_BUFFER;

  const now = Date.now();
  const idleTime = now - rabbit_hole_lastActive;

  console.log("idleTime:", idleTime, "Away_THRESHOLD:", AWAY_THRESHOLD, "Stale Threshold:", STALE_THRESHOLD);

  // Been away a long time (browser closed etc) -> auto save silently
  if (idleTime > AWAY_THRESHOLD) {
    console.log("AWAY_THRESHOLD EXCEEDED - autosaving");
    await autoSave(rabbit_hole_startTime);
    return;
  }

  // Been idle a while -> prompt the user
  if (idleTime > STALE_THRESHOLD) {
    console.log("STALE_THRESHOLD EXCEEDED - prompting");
    await promptUser();
  }
}
async function promptUser() {
  const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tabs[0]) return;

  chrome.tabs.sendMessage(tabs[0].id, { type: "STALE_CHECK" }).catch((err) => {
    console.warn("Could not send STALE_CHECK to tab:", err.message);
  });
}

async function autoSave(startTime) {
  if (!startTime) {
    console.warn("AutoSave called with no startTime, aboring");
    return;
  }

  try {
    await ProcessSessionData(startTime);
    await chrome.storage.local.remove(["rabbit_hole_startTime", "rabbit_hole_lastActive"]);

    //Tell the popup to close if it's open. THIS IS FOR AUTOSAVE FUNCTIONALITY
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "DISMISS_PROMPT" }).catch(() => {
        console.warn("Could not send DISMISS_PROMPT to tab:", err.message);
      });
    }
  } catch (err) {
    console.error("Auto save failed:", err);
  }
}

// Handle responses from the content script prompt
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STALE_RESPONSE") {
    if (message.action === "keep") {
      // Reset the lastActive timer
      chrome.storage.local.set({ rabbit_hole_lastActive: Date.now() });
    } else if (message.action === "save") {
      chrome.storage.local.get("rabbit_hole_startTime", ({ rabbit_hole_startTime }) => {
        autoSave(rabbit_hole_startTime); //this will now safely bail if start time is now undefined
      });
    }
  }
});
