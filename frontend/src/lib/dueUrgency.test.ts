import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDueUrgency } from "./dueUrgency";
import type { LedgerEntry } from "../types/domain";
import { localDateFromToday } from "../test/dates";

// Computed relative to the real clock (not hardcoded literals) so these stay
// correct regardless of when the suite runs.
const daysFromToday = localDateFromToday;

const baseEntry: LedgerEntry = {
  id: 1,
  building_name: "Tower A",
  device_identifier: "EL-1",
  dob_device_number: null,
  inspection_type: "CAT1",
  last_inspection_date: "2020-01-01",
  due_date: "2021-01-01",
  status: "Compliant",
  has_open_violation: false,
};

describe("getDueUrgency", () => {
  it("maps Delinquent to 'overdue' with a plural day-count subtext", () => {
    const entry: LedgerEntry = { ...baseEntry, status: "Delinquent", due_date: daysFromToday(-12) };

    const result = getDueUrgency(entry);

    expect(result.level).toBe("overdue");
    expect(result.dayDiff).toBe(-12);
    expect(result.subtext).toBe("12 days overdue");
  });

  it("uses singular 'day' phrasing when exactly one day overdue", () => {
    const entry: LedgerEntry = { ...baseEntry, status: "Delinquent", due_date: daysFromToday(-1) };

    const result = getDueUrgency(entry);

    expect(result.subtext).toBe("1 day overdue");
  });

  it("maps Warning to 'soon' with a 'Due in N days' subtext", () => {
    const entry: LedgerEntry = { ...baseEntry, status: "Warning", due_date: daysFromToday(5) };

    const result = getDueUrgency(entry);

    expect(result.level).toBe("soon");
    expect(result.dayDiff).toBe(5);
    expect(result.subtext).toBe("Due in 5 days");
  });

  it("uses singular 'day' phrasing when due in exactly one day", () => {
    const entry: LedgerEntry = { ...baseEntry, status: "Warning", due_date: daysFromToday(1) };

    const result = getDueUrgency(entry);

    expect(result.subtext).toBe("Due in 1 day");
  });

  it("reads 'Due today' for a Warning row due today", () => {
    const entry: LedgerEntry = { ...baseEntry, status: "Warning", due_date: daysFromToday(0) };

    const result = getDueUrgency(entry);

    expect(result.dayDiff).toBe(0);
    expect(result.subtext).toBe("Due today");
  });

  it("handles a Warning row whose due date has already passed (a status/due_date combination the backend shouldn't emit, but handled gracefully) with overdue-style phrasing", () => {
    const entry: LedgerEntry = { ...baseEntry, status: "Warning", due_date: daysFromToday(-3) };

    const result = getDueUrgency(entry);

    expect(result.level).toBe("soon");
    expect(result.dayDiff).toBe(-3);
    expect(result.subtext).toBe("3 days overdue");
  });

  it("maps Compliant to 'ok' with an empty subtext", () => {
    const entry: LedgerEntry = { ...baseEntry, status: "Compliant", due_date: daysFromToday(90) };

    const result = getDueUrgency(entry);

    expect(result.level).toBe("ok");
    expect(result.subtext).toBe("");
  });

  describe("in the evening, when the UTC date has already rolled over", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // 8:30pm Oct 19 in New York (the suite's pinned TZ) is Oct 20 in UTC.
      vi.setSystemTime(new Date("2026-10-20T00:30:00Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("counts days from the viewer's local date", () => {
      const entry: LedgerEntry = { ...baseEntry, status: "Warning", due_date: "2026-10-24" };

      const result = getDueUrgency(entry);

      expect(result.dayDiff).toBe(5);
      expect(result.subtext).toBe("Due in 5 days");
    });

    it("reads 'Due today' for a row due on the local date", () => {
      const entry: LedgerEntry = { ...baseEntry, status: "Warning", due_date: "2026-10-19" };

      expect(getDueUrgency(entry).subtext).toBe("Due today");
    });
  });
});
