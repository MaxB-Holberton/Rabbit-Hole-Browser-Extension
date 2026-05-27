(() => {
  // src/maketag.js
  function makeTag(historyEntry) {
    return new Promise((resolve, reject) => {
      try {
        const tag = "derp";
        resolve({
          ...historyEntry,
          tag
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // src/history.js
  async function RabbitHoleMetadata(hist, start, end) {
    const rabbit_hole_name = `rabbit_hole_session_${Date.now()}`;
    const new_session = {};
    const new_session_metadata = {};
    new_session_metadata["title"] = "New Rabbit Hole Name";
    new_session_metadata["tag_list"] = "taglist Here";
    new_session_metadata["start_time"] = start;
    new_session_metadata["end_time"] = end;
    new_session_metadata["data"] = hist;
    new_session[rabbit_hole_name] = new_session_metadata;
    return new_session;
  }

  // src/popup.js
  document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("RabbitHole_Record").addEventListener("click", async () => {
      ToggleTimer();
    });
    document.getElementById("RabbitHole_Index").addEventListener("click", () => {
      chrome.tabs.create({ "url": chrome.runtime.getURL("index.html") });
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
      startTime: start_time
    });
    const taggedHistory = [];
    for (const entry of history) {
      const taggedEntry = await makeTag(entry);
      taggedHistory.push(taggedEntry);
    }
    const new_session = RabbitHoleMetadata(taggedHistory, start_time, end_time);
    await chrome.storage.local.set(new_session);
  }
})();
