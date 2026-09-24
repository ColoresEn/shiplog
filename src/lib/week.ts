import {
  format,
  getISOWeek,
  getISOWeekYear,
  parseISO,
  startOfISOWeek,
} from "date-fns";

/** Monday of the ISO week containing `date`, as `yyyy-MM-dd`. */
export function weekStart(date: Date = new Date()): string {
  return format(startOfISOWeek(date), "yyyy-MM-dd");
}

/** `2026-W13` style identifier used in public URLs. */
export function weekId(weekStartDate: string): string {
  const date = parseISO(weekStartDate);
  return `${getISOWeekYear(date)}-W${String(getISOWeek(date)).padStart(2, "0")}`;
}

export function weekLabel(weekStartDate: string): string {
  const date = parseISO(weekStartDate);
  return `${weekId(weekStartDate)} · ${format(date, "d MMM yyyy")}`;
}

/** Inverse of `weekId`: Monday of the given ISO week, as `yyyy-MM-dd`. */
export function weekStartFromId(id: string): string | null {
  const match = /^(\d{4})-W(\d{2})$/.exec(id);
  if (!match) return null;

  const [, year, week] = match;
  const firstMonday = startOfISOWeek(new Date(Number(year), 0, 4));
  const monday = new Date(firstMonday);
  monday.setDate(firstMonday.getDate() + (Number(week) - 1) * 7);
  return format(monday, "yyyy-MM-dd");
}

export function groupByWeek<T extends { week_start: string }>(entries: T[]) {
  const weeks = new Map<string, T[]>();
  for (const entry of entries) {
    const group = weeks.get(entry.week_start) ?? [];
    group.push(entry);
    weeks.set(entry.week_start, group);
  }
  return [...weeks.entries()];
}
