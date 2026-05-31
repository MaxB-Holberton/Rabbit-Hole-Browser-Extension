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
  function MiliToDatetime(milis) {
    return new Date(milis).toLocaleString();
  }
  function MiliToTimeString(milis) {
    let seconds = milis / 1e3;
    let minutes = milis / (1e3 * 60);
    let hours = milis / (1e3 * 60 * 60);
    let days = milis / (1e3 * 60 * 60 * 24);
    if (seconds < 60) {
      return seconds + " Sec";
    }
    if (minutes < 60) {
      return minutes + " Min";
    }
    if (hours < 24) {
      return hours + " H";
    }
    return days + " D";
  }
  function RabbitHoleMetadata(hist, start, end) {
    const rabbit_hole_name = `rabbit_hole_session_${Date.now()}`;
    const new_session = {};
    const new_session_metadata = {};
    new_session_metadata["title"] = "New Rabbit Hole Name";
    new_session_metadata["tag_list"] = ["newTag"];
    new_session_metadata["start_time_ms"] = start;
    new_session_metadata["end_time_ms"] = end;
    new_session_metadata["start_time_datetime"] = MiliToDatetime(start);
    new_session_metadata["end_time_datetime"] = MiliToDatetime(end);
    new_session_metadata["duration_string"] = MiliToTimeString(end - start);
    new_session_metadata["session_key"] = rabbit_hole_name;
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
      if (taggedHistory.length === 0) {
        console.log("No history found, skipping session save");
        return;
      }
      const new_session = RabbitHoleMetadata(taggedHistory, start_time, end_time);
      await chrome.storage.local.set(new_session);
    } catch (error) {
      console.error("TOGGLETIMER ERROR:", error);
    }
  }
})();
