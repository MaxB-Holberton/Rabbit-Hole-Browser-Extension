//======================
// CATEGORY HEURISTICS |
//======================

function determineCategory(title, url) {
  const text = `${title} ${url}`.toLowerCase();

  // CODING
  if (
    text.includes("github") ||
    text.includes("javascript") ||
    text.includes("python") ||
    text.includes("react") ||
    text.includes("docker") ||
    text.includes("w3schools") ||
    text.includes("geeksforgeeks")
  ) { return "coding"; }

  // GAMING
  if (
    text.includes("steam") ||
    text.includes("playstation") ||
    text.includes("xbox") ||
    text.includes("nintendo") ||
    text.includes("ign") ||
    text.includes("square enix") ||
    text.includes("fromsoftware") //praise the sun!
  ) { return "gaming"; }

  // SHOPPING
  if (
    text.includes("amazon") ||
    text.includes("ebay") ||
    text.includes("etsy") ||
    text.includes("redbubble") ||
    text.includes("depop")
  ) { return "shopping"; }

  // SOCIAL
  if (
    text.includes("facebook") ||
    text.includes("reddit") ||
    text.includes("twitter") ||
    text.includes("bluesky") ||
    text.includes("instagram") ||
    text.includes("tiktok") ||
    text.includes("youtube")
  ) { return "social"; }

  //EDUCATION
  if (
    text.includes("wikipedia") ||
    text.includes("coursera") ||
    text.includes("udemy") ||
    text.includes("monash") ||
    text.includes("swinburne") ||
    text.includes(".edu") ||
    text.includes(".edu.au")
  ) { return "learning"; }

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

