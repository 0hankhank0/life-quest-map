export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function isToday(value: string | null): boolean {
  if (!value) {
    return false;
  }

  return value.slice(0, 10) === todayKey();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
