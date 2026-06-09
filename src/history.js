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

//Get all rabbit hole sessions
export async function RHGetSessionList() {
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

//Get a single page from local storage
export async function RHGetPage(key) {
  const history_item = await chrome.storage.local.get(key);
  return history_item[key];
}

// Delete a session
export async function RHDeleteSession(session_key) {
  console.log(session_key);
  if(confirm("Are you sure you want to delete this rabbit hole?"))
  {
    console.log("deleting...");
    await chrome.storage.local.remove([session_key]);
    window.location.href = "/index.html#/overview";
  }
}

export async function RHSaveSession(page_data, pages_vals, tags_vals) {
  const session_key = page_data.session_key;
  const new_session = {};
  const page_keys = Object.keys(pages_vals);
  const tags_keys = tags_vals.keys();
  console.log(page_keys);
  console.log(tags_keys);
  //run loop for pages_vals
  //run loop for tags_vals
  new_session[session_key] = page_data;
  await chrome.storage.local.set(new_session);
}

// Delete a page
/*
export async function RHDeletePage(index, key) {
  if(confirm(`Delete this page?`))
  {
    chrome.storage.local.get(key).then((data) => {
      data[key].data.splice(index, 1);
      return data;
    }).then(async (data) => {
      await chrome.storage.local.set(data);
    });
  }
}

export async function RHEditPage(index, key) {
  const btn = document.getElementById(`${index}_edit`);
  const input = document.getElementById(`${index}_input`);
  if (input.readOnly === true)
  {
    console.log("readonly: true -> false");
    input.readOnly = false;
    //a.style = "pointer-events: none";
  }
  else if (input.readOnly === false)
  {
    console.log("readonly: false -> true");
    input.readOnly = true;
    //a.style = "";
    chrome.storage.local.get(key).then((data) => {
      data[key].data[index].title = input.value;
      return data;
    }).then(async (data) => {
      await chrome.storage.local.set(data);
    });
  }
}
*/
