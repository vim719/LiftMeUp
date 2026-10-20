import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { localDateFromToday } from "./dates";

describe("localDateFromToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("runs the suite in a non-UTC timezone so date-boundary bugs surface in CI", () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe("America/New_York");
  });

  it("uses the local calendar date, not the UTC date, in the evening", () => {
    // 8:30pm in New York is already the next day in UTC.
    vi.setSystemTime(new Date("2026-10-20T00:30:00Z"));

    expect(localDateFromToday(0)).toBe("2026-10-19");
    expect(localDateFromToday(5)).toBe("2026-10-24");
    expect(localDateFromToday(-1)).toBe("2026-10-18");
  });

  it("zero-pads single-digit months and days", () => {
    vi.setSystemTime(new Date("2026-03-04T12:00:00Z"));

    expect(localDateFromToday(0)).toBe("2026-03-04");
  });

  it("crosses a DST change without drifting a day", () => {
    // DST ends in New York on 2026-11-01.
    vi.setSystemTime(new Date("2026-10-31T23:30:00-04:00"));

    expect(localDateFromToday(1)).toBe("2026-11-01");
    expect(localDateFromToday(2)).toBe("2026-11-02");
  });
});
