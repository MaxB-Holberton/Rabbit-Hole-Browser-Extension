function MiliToDatetime(milis) {
  return new Date(milis).toLocaleString();
}

function MiliToTimeString(milis) {
  let seconds = Math.trunc(milis / 1000);
  let minutes = Math.trunc(milis / (1000 * 60));
  let hours = Math.trunc(milis / (1000 * 60 * 60));
  let days = Math.trunc(milis / (1000 * 60 * 60 * 24));
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
  new_session_metadata['tag_list'] = ['newSession'];
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

const blacklist_key = "rabbithole_blacklist_data";
export async function GetBlacklist() {
  return await RHGetPage(blacklist_key);
}

export async function SetBlacklist(blacklist_data) {
  await chrome.storage.local.set({ [blacklist_key]: blacklist_data });
  return;
}

// "Are you still watching?" stale prompt timeout, stored in minutes
const stale_threshold_key = "rabbithole_stale_threshold_min";
export const DEFAULT_STALE_THRESHOLD_MIN = 45;

export async function GetStaleThresholdMinutes() {
  const stored = await RHGetPage(stale_threshold_key);
  return stored ?? DEFAULT_STALE_THRESHOLD_MIN;
}

// Checks fire at ~1/4 of the threshold so smaller thresholds don't drift
// by a large relative margin, floored/ceilinged to keep things sane.
// Note: Chrome clamps periodInMinutes below 1 to 1 minute for packed/
// published extensions - sub-minute periods only work while unpacked
// (developer mode), which is fine for local testing.
export function GetStaleCheckPeriodMinutes(staleThresholdMinutes) {
  return Math.min(5, Math.max(0.5, staleThresholdMinutes / 4));
}

export async function ScheduleStaleCheckAlarm() {
  const staleThresholdMinutes = await GetStaleThresholdMinutes();
  const periodInMinutes = GetStaleCheckPeriodMinutes(staleThresholdMinutes);
  // Re-creating an alarm with the same name replaces the existing one
  chrome.alarms.create("staleCheck", { periodInMinutes });
}

export async function SetStaleThresholdMinutes(minutes) {
  await chrome.storage.local.set({ [stale_threshold_key]: minutes });
  await ScheduleStaleCheckAlarm();
  return;
}
