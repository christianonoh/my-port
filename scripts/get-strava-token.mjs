/**
 * One-time helper to mint a Strava refresh token that has the `activity:read`
 * scope (the one the "On the Run" widget needs).
 *
 * Usage:
 *   1. Open this URL in your browser (uses STRAVA_CLIENT_ID from .env):
 *
 *        node scripts/get-strava-token.mjs
 *
 *      With no args it just prints the authorize URL to click.
 *
 *   2. Approve the "View data about your activities" checkbox on Strava.
 *      You'll be redirected to http://localhost/?...&code=XXXX (the page won't
 *      load — that's fine, you only need the `code` from the address bar).
 *
 *   3. Exchange that code for a refresh token:
 *
 *        node scripts/get-strava-token.mjs <code>
 *
 *      Copy the printed STRAVA_REFRESH_TOKEN into your .env, then restart dev.
 *
 * Reads STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET from .env so no secret is ever
 * typed on the command line.
 */
import { readFileSync } from "node:fs";

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // no .env — fall back to process.env below
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const clientId = env.STRAVA_CLIENT_ID;
const clientSecret = env.STRAVA_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Missing STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET in .env");
  process.exit(1);
}

const code = process.argv[2];

if (!code) {
  const url =
    `https://www.strava.com/oauth/authorize?client_id=${clientId}` +
    `&response_type=code&redirect_uri=http://localhost` +
    `&approval_prompt=force&scope=activity:read`;
  console.log("\n1) Open this URL in your browser and approve access:\n");
  console.log("   " + url + "\n");
  console.log(
    "2) After approving, copy the `code` value from the redirected URL and run:\n"
  );
  console.log("   node scripts/get-strava-token.mjs <code>\n");
  process.exit(0);
}

const res = await fetch("https://www.strava.com/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
  }),
});

const data = await res.json();

if (!res.ok || !data.refresh_token) {
  console.error("Token exchange failed:", res.status, data);
  process.exit(1);
}

const scopeOk = String(data.scope || "").includes("activity:read");
console.log("\n✓ Success! Put this in your .env:\n");
console.log(`STRAVA_REFRESH_TOKEN=${data.refresh_token}\n`);
console.log(`granted scope: ${data.scope}`);
if (!scopeOk) {
  console.log(
    "\n⚠  Warning: the granted scope does not include activity:read — make sure you checked the activity permission box."
  );
}
console.log("\nThen restart the dev server so it picks up the new token.\n");
