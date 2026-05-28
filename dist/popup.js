(() => {
  // src/maketag.js
  function determineCategory(title, url) {
    const text = `${title} ${url}`.toLowerCase();
    if (text.includes("github") || text.includes("javascript") || text.includes("python") || text.includes("react") || text.includes("docker")) {
      return "coding";
    }
    if (text.includes("steam") || text.includes("playstation") || text.includes("xbox") || text.includes("nintendo") || text.includes("ign") || text.includes("square enix") || text.includes("fromsoftware")) {
      return "gaming";
    }
    if (text.includes("amazon") || text.includes("ebay") || text.includes("etsy") || text.includes("redbubble") || text.includes("depop")) {
      return "shopping";
    }
    if (text.includes("facebook") || text.includes("reddit") || text.includes("twitter") || text.includes("bluesky") || text.includes("instagram") || text.includes("tiktok") || text.includes("youtube")) {
      return "social";
    }
    if (text.includes("wikipedia") || text.includes("coursera") || text.includes("udemy") || text.includes("monash") || text.includes("swinburne") || text.includes(".edu") || text.includes(".edu.au")) {
      return "learning";
    }
    return "general";
  }
  function getStructuralTags(url) {
    const u = new URL(url);
    let hostname = u.hostname.replace("www.", "");
    return [hostname];
  }
  function makeTag(historyEntry) {
    return new Promise((resolve, reject) => {
      try {
        const category = determineCategory(historyEntry.title, historyEntry.url);
        const structuralTags = getStructuralTags(historyEntry.url);
        resolve({
          ...historyEntry,
          category,
          structuralTags,
          concepts: [],
          manualTags: []
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
      console.log("BUTTON PRESSED");
      ToggleTimer();
      console.log("FUNCTION FINISHED");
    });
    document.getElementById("RabbitHole_Index").addEventListener("click", () => {
      chrome.tabs.create({ "url": chrome.runtime.getURL("index.html") });
    });
  });
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
      await chrome.storage.session.remove(["rabbit_hole_startTime"]);
      const end_time = Date.now();
      const history = await chrome.history.search({
        text: "",
        startTime: start_time
      });
      console.log("HISTORY:", history);
      const taggedHistory = [];
      for (const entry of history) {
        const taggedEntry = await makeTag(entry);
        taggedHistory.push(taggedEntry);
      }
      const new_session = await RabbitHoleMetadata(taggedHistory, start_time, end_time);
      await chrome.storage.local.set(new_session);
    } catch (error) {
      console.error("TOGGLETIMER ERROR:", error);
    }
  }
})();
