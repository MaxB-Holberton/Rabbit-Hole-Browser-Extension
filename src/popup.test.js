import { formatElapsed, StripBlacklistedItems } from "./popup.js";


//MOCK CHROME FOR TESTING
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn()
    }
  },
  history: {
    search: jest.fn()
  }
};


//FORMAT ELAPSED TESTS

describe("formatElapsed", () => {
  test("formats seconds only", () => {
    expect(formatElapsed(5000)).toBe("00:05");
  });

  test("formats minutes and seconds", () => {
    expect(formatElapsed(65000)).toBe("01:05");
  });

  test("formats hours when over 60 minutes", () => {
    expect(formatElapsed(3661000)).toBe("01:01:01");
  });

  test("returns 00:00 for zero", () => {
    expect(formatElapsed(0)).toBe("00:00");
  });

  test("handles negative values gracefully", () => {
    expect(formatElapsed(-1000)).toBe("00:00");
  });
});

//BLACKLISTING TESTING

describe("StripBlacklistedItems", () => {
    test("returns empty array when history is empty", async () => {
    global.chrome.storage.local.get = jest.fn().mockResolvedValue({ 
      rabbithole_blacklist_data: undefined 
    });
    const result = await StripBlacklistedItems([]);
    expect(result).toEqual([]);
  });

  test("returns history as-is when blacklist is undefined", async () => {
    global.chrome.storage.local.get = jest.fn().mockResolvedValue({ rabbithole_blacklist_data: undefined });
    const history = [{ url: "https://google.com" }, { url: "https://youtube.com" }];
    const result = await StripBlacklistedItems(history);
    expect(result).toEqual(history);
  });

  test("returns history as-is when no blacklist items are active", async () => {
    global.chrome.storage.local.get = jest.fn().mockResolvedValue({
      rabbithole_blacklist_data: [{ name: "google.com", active: false }]
    });
    const history = [{ url: "https://google.com" }, { url: "https://youtube.com" }];
    const result = await StripBlacklistedItems(history);
    expect(result).toEqual(history);
  });

  test("strips items that match an active blacklist entry", async () => {
    global.chrome.storage.local.get = jest.fn().mockResolvedValue({
      rabbithole_blacklist_data: [{ name: "google.com", active: true }]
    });
    const history = [{ url: "https://google.com" }, { url: "https://youtube.com" }];
    const result = await StripBlacklistedItems(history);
    expect(result).not.toContainEqual({ url: "https://google.com" });
    expect(result).toContainEqual({ url: "https://youtube.com" });
  });

  test("strips www. variants correctly", async () => {
    global.chrome.storage.local.get = jest.fn().mockResolvedValue({
      rabbithole_blacklist_data: [{ name: "google.com", active: true }]
    });
    const history = [{ url: "https://www.google.com/search?q=test" }];
    const result = await StripBlacklistedItems(history);
    expect(result).toEqual([]);
  });
});