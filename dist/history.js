(() => {
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
})();
