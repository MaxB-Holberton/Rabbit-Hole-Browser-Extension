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
// Delete a page
/*
export async function RHDeletePage(index, key) {
  if (confirm(`Delete this page?`)) {
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
  if (input.readOnly === true) {
    console.log("readonly: true -> false");
    input.readOnly = false;
    //a.style = "pointer-events: none";
  }
  else if (input.readOnly === false) {
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
<<<<<<< HEAD

//Session tag deletion
export async function RHRemoveSessionTag(session_key, tag) {
  const data = await chrome.storage.local.get(session_key);
  const session = data[session_key];

  if (!session?.tag_list) return;

  session.tag_list = session.tag_list.filter(t => t !== tag);

  await chrome.storage.local.set({
    [session_key]: session
  });
  return session;
}

//Adding tags

export async function RHAddSessionTag(session_key, tag) {
  const data = await chrome.storage.local.get(session_key);
  const session = data[session_key];
  if (!session) return;

  //check if it's null, trim for whitespace and then check if it's not empty
  if (!tag) return;
  tag = tag.trim();
  if (!tag) return;

  //Create tag list if it doesn't exist yet
  if (!session.tag_list) {
    session.tag_list = [];
  }

  if (!session.tag_list.includes(tag)) {
    session.tag_list.push(tag);
  }
  await chrome.storage.local.set({
    [session_key]: session
  });
  return session;
}
=======
>>>>>>> dev
*/
