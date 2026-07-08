/**
 * Running personal records, shown in the "On the Run" section on the About page.
 *
 * These are maintained by hand — Strava's API doesn't expose distance PRs
 * without fetching every activity's detail, and PRs only change when you set a
 * new best. Update the `time` values below with your real times.
 *
 * For a distance you haven't raced yet, set `time: null` and add a `goal`
 * label — it renders as an aspirational target instead of a time.
 */

export interface PersonalRecord {
  label: string; // "5K"
  meta: string; // distance, e.g. "5 km"
  time: string | null; // "22:00" — or null if not raced yet
  goal?: string; // shown when time is null, e.g. "Feb 2027"
}

export const personalRecords: PersonalRecord[] = [
  // TODO: replace these placeholder times with your real PRs.
  { label: "5K", meta: "5 km", time: "22:49" },
  { label: "10K", meta: "10 km", time: "48:15" },
  { label: "Half Marathon", meta: "21.1 km", time: "1:43:27" },
  { label: "Marathon", meta: "42.2 km", time: null, goal: "Feb 2027" },
];
