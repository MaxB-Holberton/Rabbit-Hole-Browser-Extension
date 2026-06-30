import makeTag from "./maketag";
import { RabbitHoleMetadata, GetBlacklist } from "./history";
import { getManualTags, getPageId } from "./tagStore";

//===============================
// SHARED SESSION FUNCTIONALITY |
//===============================

export async function enrichHistory(history) {
  const manualTags = await getManualTags();

  return history.map(entry => {
    const pageId = getPageId(entry.url);

    return {
      ...entry,
      manualTags: manualTags[pageId] ?? []
    };
  });
}

export async function StripBlacklistedItems(history)
{
  const stripped_data = [];
  const active_items = [];
  const blacklist_data = await GetBlacklist();
  let active_count = 0;

  if (history.length === 0)
  {
    return ([]);//return a 0 length array
  }

  if (blacklist_data === undefined)
  {
    return history;
  }

  for (const active_item of blacklist_data)
  {
    if (active_item.active)
    {
      active_count += 1;
      active_items.unshift(active_item.name);
      continue;
    }
  }

  if (active_count === 0)
  {
    //No blacklist is enabled,
    //no point running through the lists
    return history;
  }

  for (const item of history)
  {
    const url = new URL(item.url);
    const url_host = url.hostname.toString().replace("www.", "").toLowerCase();
    let match_lock = false;
    for (const blacklist of active_items)
    {
      //for each item in the list of active blacklist items.
      if (url_host.includes(blacklist.toLowerCase()))
      {
        match_lock = true;
        break;
      }
    }
    if(match_lock)
    {
      continue;
    }
    stripped_data.unshift(item);
  }

  return stripped_data;
}

export async function ProcessSessionData(start_time)
{
  const end_time = Date.now();
  const taggedHistory = [];
  const history = await chrome.history.search({
    text: "",
    startTime: start_time,
  });

  if (history.length === 0)
  {
    //nothing to write so just return
    return;
  }

  const stripped_history = await StripBlacklistedItems(history);

  for (const entry of stripped_history) {
    const taggedEntry = await makeTag(entry);
    taggedHistory.push(taggedEntry);
  }
  const enriched = await enrichHistory(taggedHistory);

  const new_session = RabbitHoleMetadata(enriched, start_time, end_time);

  await chrome.storage.local.set(new_session);
  await chrome.storage.local.set({ rabbit_hole_status: "finished" });
}