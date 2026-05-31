(() => {
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
  async function GetRabbitHoleHistory() {
    const rtn_history = [];
    const key_list = await chrome.storage.local.getKeys();
    for (const key of key_list) {
      if (key.includes("_session_")) {
        const history_item = await chrome.storage.local.get(key);
        rtn_history.push(history_item[key]);
      }
    }
    return rtn_history;
  }
  async function ToggleSessionEdits(session_key) {
  }
  async function DeleteRabbitHoleSession(session_key) {
    console.log(session_key);
    if (confirm("Are you sure you want to delete this rabbit hole?")) {
      console.log("deleting...");
      await chrome.storage.local.remove([session_key]);
      document.getElementById(session_key).remove();
    }
  }
})();
