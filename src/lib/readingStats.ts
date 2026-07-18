/**
 * readingStats — lightweight reading-statistics helper backed by localStorage.
 *
 * Used by:
 *   - Home dashboard (7-day word-count chart, current streak)
 *   - Reader (logs words read per session via addWordsToday)
 *
 * Deliberately localStorage (not IndexedDB) to avoid a schema migration:
 * this is derived analytics, not source-of-truth reading data.
 */

const KEY = "readpilot_daily_stats_v1"; // Record<"YYYY-MM-DD", wordsRead>

type DailyMap = Record<string, number>;

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): DailyMap {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DailyMap) : {};
  } catch {
    return {};
  }
}

function writeAll(data: DailyMap): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked — analytics only, swallow */
  }
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Accumulate words read onto today's bucket. Safe to call on every word advance. */
export function addWordsToday(deltaWords: number): void {
  if (!deltaWords || deltaWords <= 0) return;
  const data = readAll();
  const k = dateKey(new Date());
  data[k] = (data[k] || 0) + deltaWords;
  writeAll(data);
}

export interface DayStat {
  date: string; // YYYY-MM-DD
  label: string; // single-letter weekday
  words: number;
}

/** Returns the last 7 calendar days (oldest → newest), labels single-letter weekday. */
export function getLast7Days(): DayStat[] {
  const data = readAll();
  const weekday = ["S", "M", "T", "W", "T", "F", "S"];
  const out: DayStat[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const k = dateKey(d);
    out.push({ date: k, label: weekday[d.getDay()], words: data[k] || 0 });
  }
  return out;
}

/**
 * Current streak: consecutive days (ending today or yesterday) with > 0 words read.
 * Counts today only if the user has already logged words.
 */
export function getStreak(): number {
  const data = readAll();
  let streak = 0;
  const cursor = new Date();
  // If today has no activity yet, start counting from yesterday so the streak
  // doesn't appear "broken" before the user reads today.
  if (!(data[dateKey(cursor)] > 0)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (data[dateKey(cursor)] > 0) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Sum of all words ever logged (since feature inception). Understates older history. */
export function getTotalWordsAllTime(): number {
  const data = readAll();
  return Object.values(data).reduce((sum, n) => sum + n, 0);
}
