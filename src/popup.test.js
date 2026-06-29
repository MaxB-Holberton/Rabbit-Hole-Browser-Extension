import { formatElapsed } from "./popup.js";

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