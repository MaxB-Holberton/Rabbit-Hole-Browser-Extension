const STALE_THRESHOLD = 1 * 60 * 1000; // 10 minutes
const AWAY_THRESHOLD = 2 * 60 * 60 * 1000; // 2 hours = auto save

// Update lastActive on new page visit
chrome.history.onVisited.addListener(() => {
  chrome.storage.local.set({ rabbit_hole_lastActive: Date.now() });
});

// Update lastActive on tab switch
chrome.tabs.onActivated.addListener(() => {
  chrome.storage.local.set({ rabbit_hole_lastActive: Date.now() });
});

// Check for stale session every minute
chrome.alarms.create("staleCheck", { periodInMinutes: 1});

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
  // rest of the function...
}

  const { rabbit_hole_startTime, rabbit_hole_lastActive } = data;

  // No active session, nothing to do
  if (!rabbit_hole_startTime) return;

  const now = Date.now();
  const idleTime = now - rabbit_hole_lastActive;

  // Been away a long time (browser closed etc) -> auto save silently
  if (idleTime > AWAY_THRESHOLD) {
    await autoSave(rabbit_hole_startTime);
    return;
  }

  // Been idle a while -> prompt the user
  if (idleTime > STALE_THRESHOLD) {
    await promptUser();
  }
}

async function promptUser() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs[0]) return;

  chrome.tabs.sendMessage(tabs[0].id, { type: "STALE_CHECK" });
}

async function autoSave(startTime) {
  try {
    // import ProcessSessionData won't work in service worker directly
    // so we message the popup instead
    await chrome.storage.local.set({ rabbit_hole_autoSave: true });
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
        autoSave(rabbit_hole_startTime);
      });
    }
  }
});