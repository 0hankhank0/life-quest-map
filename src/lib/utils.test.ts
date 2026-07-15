import { describe, expect, it } from "vitest";
import { addCalendarDays, calendarDateKey, calendarDayDifference } from "@/lib/utils";

describe("calendar date utilities", () => {
  const taipei = "Asia/Taipei";

  it("maps the Taiwan midnight boundary independently of the system time zone", () => {
    expect(calendarDateKey(new Date("2026-07-14T15:59:59.999Z"), taipei)).toBe("2026-07-14");
    expect(calendarDateKey(new Date("2026-07-14T16:00:00.000Z"), taipei)).toBe("2026-07-15");
  });

  it("does calendar arithmetic without parsing date-only strings as local instants", () => {
    expect(addCalendarDays("2026-07-14", 1)).toBe("2026-07-15");
    expect(calendarDayDifference("2026-07-14", "2026-07-15")).toBe(1);
  });
});
