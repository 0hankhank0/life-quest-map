/** A validated ISO calendar-date string (`YYYY-MM-DD`), not an instant in time. */
export type CalendarDate = string;

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Returns a calendar date in the browser's local zone, or an explicitly supplied IANA time zone. */
export function calendarDateKey(date = new Date(), timeZone?: string): CalendarDate {
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  if (!timeZone) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes): string => {
    const part = parts.find((item) => item.type === type);
    if (!part) throw new Error(`Missing ${type} date part`);
    return part.value;
  };
  return `${value("year")}-${value("month")}-${value("day")}`;
}

/** @deprecated Prefer calendarDateKey to make the calendar-date intent explicit. */
export const todayKey = calendarDateKey;

function parseCalendarDate(value: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid calendar date: ${value}`);
  const [, year, month, day] = match;
  const instant = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (instant.getUTCFullYear() !== Number(year) || instant.getUTCMonth() !== Number(month) - 1 || instant.getUTCDate() !== Number(day)) throw new Error(`Invalid calendar date: ${value}`);
  return [Number(year), Number(month), Number(day)];
}

export function addCalendarDays(value: string, amount: number): CalendarDate {
  const [year, month, day] = parseCalendarDate(value);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function calendarDayDifference(from: string, to: string): number {
  const [fromYear, fromMonth, fromDay] = parseCalendarDate(from);
  const [toYear, toMonth, toDay] = parseCalendarDate(to);
  return Math.round((Date.UTC(toYear, toMonth - 1, toDay) - Date.UTC(fromYear, fromMonth - 1, fromDay)) / 86_400_000);
}

export function calendarWeekday(value: string): number {
  const [year, month, day] = parseCalendarDate(value);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function formatCalendarShortDate(value: string): string {
  const [, month, day] = parseCalendarDate(value);
  return `${month}/${day}`;
}

export function isToday(value: string | null, timeZone?: string, now = new Date()): boolean {
  return Boolean(value) && calendarDateKey(new Date(value as string), timeZone) === calendarDateKey(now, timeZone);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
