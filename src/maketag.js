//======================
// CATEGORY HEURISTICS |
//======================

// Escapes regex special characters so keywords like ".edu" are matched
// literally rather than as regex syntax.
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Builds a case-sensitive-agnostic word-boundary regex for a keyword.
// \b ensures "react" doesn't match inside "reactor", "ign" doesn't match
// inside "design", etc. Keywords are matched against already-lowercased text.
function keywordRegex(keyword) {
  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`);
}

// Returns true if any keyword matches text as a whole word/phrase.
function matchesAny(text, keywords) {
  return keywords.some((keyword) => keywordRegex(keyword).test(text));
}

const CATEGORY_KEYWORDS = {
  coding: [
    "github",
    "javascript",
    "python",
    "react",
    "reactjs",
    "react.dev",
    "docker",
    "w3schools",
    "geeksforgeeks",
    "codecademy",
  ],
  gaming: [
    "steam",
    "playstation",
    "xbox",
    "nintendo",
    "ign",
    "square enix",
    "fromsoftware", //praise the sun!
  ],
  shopping: ["amazon", "ebay", "etsy", "redbubble", "depop"],
  social: [
    "facebook",
    "reddit",
    "twitter",
    "bluesky",
    "instagram",
    "tiktok",
    "youtube",
  ],
  learning: [
    "wikipedia",
    "coursera",
    "udemy",
    "monash",
    "swinburne",
    ".edu",
    ".edu.au",
    "britannica",
  ],
};

function determineCategory(title, url) {
  const text = `${title} ${url}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (matchesAny(text, keywords)) return category;
  }

  return "general";
}

//=================
// STRUCTURAL TAGS |
//=================

function getStructuralTags(url) {
  const u = new URL(url);
  let hostname = u.hostname.replace("www.", "");
  return [hostname];
}

//========================
// MAIN TAGGING FUNCTION |
//========================

export default function makeTag(historyEntry) {
  return new Promise((resolve, reject) => {
    try {
      const category = determineCategory(historyEntry.title, historyEntry.url);
      const structuralTags = getStructuralTags(historyEntry.url);

      resolve({
        ...historyEntry,
        category,
        structuralTags,

        concepts: [],
      });
    } catch (error) {
      reject(error);
    }
  });
}

