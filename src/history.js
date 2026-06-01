
/*
 * Time functions for
 */
function MiliToDatetime(milis) {
  return new Date(milis).toLocaleString();
}

function MiliToTimeString(milis) {
  let seconds = (milis / 1000);
  let minutes = (milis / (1000 * 60));
  let hours = (milis / (1000 * 60 * 60));
  let days = (milis / (1000 * 60 * 60 * 24));
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

/*
* Adding metadata to Session
*/
export function RabbitHoleMetadata(hist, start, end) {
  const rabbit_hole_name = `rabbit_hole_session_${Date.now()}`;

  const new_session = {};
  const new_session_metadata = {};
  // create the metadata
  new_session_metadata['title'] = 'New Rabbit Hole Name';
  new_session_metadata['tag_list'] = ['newTag', 'Testtag', 'tagtheThird'];
  new_session_metadata['start_time_ms'] = start;
  new_session_metadata['end_time_ms'] = end;
  new_session_metadata['start_time_datetime'] = MiliToDatetime(start);
  new_session_metadata['end_time_datetime'] = MiliToDatetime(end);
  new_session_metadata['duration_string'] = MiliToTimeString(end - start);
  new_session_metadata['session_key'] = rabbit_hole_name;
  new_session_metadata['data'] = hist;
  new_session[rabbit_hole_name] = new_session_metadata;

  return (new_session);
}

/*
 * Getting the History
 */
export async function RHGetSessionList() {
  const rtn_history = [];
  const key_list = await chrome.storage.local.getKeys();

  for (const key of key_list) {
    if (key.includes("_session_")) {
      const history_item = await chrome.storage.local.get(key)
      rtn_history.push(history_item[key]);
    }
  }

  return rtn_history;
}

export async function RHGetPage(key) {
  const history_item = await chrome.storage.local.get(key);
  return history_item[key];
}

// Session Deleted
export async function RHDeleteSession(session_key) {
  console.log(session_key);
  if(confirm("Are you sure you want to delete this rabbit hole?"))
  {
    console.log("deleting...");
    await chrome.storage.local.remove([session_key]);
    document.getElementById(session_key).remove();
  }
}
