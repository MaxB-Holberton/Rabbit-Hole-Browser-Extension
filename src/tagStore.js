//=====================
// MANUAL TAG STORAGE |
//=====================

const MANUAL_TAGS_KEY = "manualTagsByPage";

export async function getManualTags() {
  const data = await chrome.storage.local.get(MANUAL_TAGS_KEY);
  return data[MANUAL_TAGS_KEY] ?? {};
}

export async function addManualTag(pageId, tag) {
  const all = await getManualTags();

  if (!all[pageId]) {
    all[pageId] = [];
  }

  if (!all[pageId].includes(tag)) {
    all[pageId].push(tag);
  }

  await chrome.storage.local.set({
    [MANUAL_TAGS_KEY]: all
  });

  return all[pageId];
}

export async function removeManualTag(pageId, tag) {
  const all = await getManualTags();

  if (!all[pageId]) return [];

  all[pageId] = all[pageId].filter(t => t !== tag);

  await chrome.storage.local.set({
    [MANUAL_TAGS_KEY]: all
  })

  return all[pageId];
}

export function getPageId(url) {
  const u = new URL(url);
  return `${u.hostname.replace("www.", "")}${u.pathname}`;
}
