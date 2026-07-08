import "server-only";

/**
 * Strava integration.
 *
 * We use the "single athlete" pattern: a one-time OAuth authorization grants a
 * long-lived refresh token, which we exchange for a short-lived access token on
 * demand. Nothing here is exposed to the client — this module is server-only and
 * the secrets live in env vars.
 *
 * Required env (see .env.example):
 *   STRAVA_CLIENT_ID
 *   STRAVA_CLIENT_SECRET
 *   STRAVA_REFRESH_TOKEN
 */

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";

// A raw Strava activity (only the fields we use).
interface StravaActivity {
  id: number;
  name: string;
  type: string; // "Run", "Ride", ...
  distance: number; // meters
  moving_time: number; // seconds
  total_elevation_gain: number; // meters
  start_date_local: string; // ISO
}

export interface RunStats {
  weekKm: number; // distance run in the last 7 days
  weekRuns: number; // number of runs in the last 7 days
  lastRun: {
    name: string;
    km: number;
    pacePerKm: string; // "5:12"
    date: string; // ISO
  } | null;
  // Per-day distance (km) for the last 7 days, oldest → newest, for a sparkline.
  spark: number[];
}

async function getAccessToken(): Promise<string | null> {
  const client_id = process.env.STRAVA_CLIENT_ID;
  const client_secret = process.env.STRAVA_CLIENT_SECRET;
  const refresh_token = process.env.STRAVA_REFRESH_TOKEN;

  if (!client_id || !client_secret || !refresh_token) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id,
      client_secret,
      grant_type: "refresh_token",
      refresh_token,
    }),
    // The token itself changes; don't cache this exchange.
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

function formatPace(movingTimeSec: number, distanceMeters: number): string {
  if (distanceMeters <= 0) return "—";
  const secPerKm = movingTimeSec / (distanceMeters / 1000);
  const min = Math.floor(secPerKm / 60);
  const sec = Math.round(secPerKm % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

/**
 * Fetch recent runs and aggregate them into display stats.
 * Returns null on any missing config or failure so callers can render nothing
 * rather than break the page. Cached for an hour to stay well within Strava's
 * rate limits.
 */
export async function getRunStats(): Promise<RunStats | null> {
  try {
    const token = await getAccessToken();
    if (!token) return null;

    const res = await fetch(`${ACTIVITIES_URL}?per_page=50`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 }, // refresh at most once an hour
    });
    if (!res.ok) return null;

    const activities = (await res.json()) as StravaActivity[];
    const runs = activities.filter((a) => a.type === "Run");

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekAgo = now - 7 * dayMs;

    // Per-day buckets for the last 7 days (index 0 = 6 days ago, 6 = today).
    const spark = new Array(7).fill(0);
    let weekMeters = 0;
    let weekRuns = 0;

    for (const run of runs) {
      const t = new Date(run.start_date_local).getTime();
      if (t >= weekAgo) {
        weekMeters += run.distance;
        weekRuns += 1;
        const dayIndex = Math.min(6, Math.floor((t - weekAgo) / dayMs));
        spark[dayIndex] += run.distance / 1000;
      }
    }

    const latest = runs[0]; // Strava returns newest first
    const lastRun = latest
      ? {
          name: latest.name,
          km: Math.round((latest.distance / 1000) * 10) / 10,
          pacePerKm: formatPace(latest.moving_time, latest.distance),
          date: latest.start_date_local,
        }
      : null;

    return {
      weekKm: Math.round((weekMeters / 1000) * 10) / 10,
      weekRuns,
      lastRun,
      spark: spark.map((km) => Math.round(km * 10) / 10),
    };
  } catch {
    return null;
  }
}
