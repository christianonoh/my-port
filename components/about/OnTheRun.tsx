import { getRunStats } from "@/lib/strava";
import Highlight from "../shared/Highlight";
import { StravaIcon } from "../icons";
import { BiLinkExternal } from "react-icons/bi";
import siteMetadata from "@/utils/siteMetaData";
import PersonalRecords from "./PersonalRecords";

const OnTheRun = async () => {
  const stats = await getRunStats();
  const max = stats ? Math.max(...stats.spark, 1) : 1;

  return (
    <section className="mt-24 max-w-[731.250px] mx-auto lg:mx-0 lg:max-w-2xl">
      <h2 className="font-semibold text-4xl mb-4">
        <Highlight>On the Run</Highlight>
      </h2>
      <p className="text-sm sm:text-lg dark:text-gray text-gray-dark max-w-lg">
        When I&apos;m away from the keyboard, you&apos;ll usually find me
        logging kilometres. Here&apos;s where I&apos;m at.
      </p>

      <div
        className={`mt-8 grid gap-6 ${stats ? "sm:grid-cols-2" : ""}`}
      >
        {/* Live weekly card — only when Strava data is available */}
        {stats && (
        <div className="rounded-2xl border border-gray-light dark:border-gray-dark p-6 sm:p-8 dark:bg-dark/40 bg-light/60 shadow-sm dark:shadow-light/5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gray dark:text-gray">
            <StravaIcon className="h-4 w-4 fill-accent" />
            This week
          </div>
          <a
            href={siteMetadata.strava}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View profile on Strava"
            className="inline-flex items-center gap-1.5 text-sm text-gray-dark dark:text-gray hover:text-accent dark:hover:text-accent transition-colors duration-200"
          >
            Strava <BiLinkExternal className="text-base" />
          </a>
        </div>

        {/* Headline stat */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-semibold tabular-nums dark:text-light text-dark">
            {stats.weekKm}
          </span>
          <span className="text-lg text-gray dark:text-gray">km</span>
          <span className="ml-2 text-sm text-gray dark:text-gray">
            across {stats.weekRuns} {stats.weekRuns === 1 ? "run" : "runs"}
          </span>
        </div>

        {/* Sparkline: one bar per day, last 7 days */}
        <div className="mt-6 flex items-end gap-1.5 h-16" aria-hidden="true">
          {stats.spark.map((km, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-accent/70 hover:bg-accent transition-colors duration-200"
              style={{ height: `${Math.max((km / max) * 100, 4)}%` }}
              title={`${km} km`}
            />
          ))}
        </div>
        <p className="sr-only">
          Daily distance over the last seven days:{" "}
          {stats.spark.map((km) => `${km} km`).join(", ")}.
        </p>

        {/* Last run */}
        {stats.lastRun && (
          <div className="mt-6 pt-6 border-t border-gray-light dark:border-gray-dark flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-gray dark:text-gray">
              Last run
              <span className="ml-2 font-medium dark:text-light text-dark">
                {stats.lastRun.km} km
              </span>
            </span>
            <span className="text-gray dark:text-gray">
              Pace
              <span className="ml-2 font-medium dark:text-light text-dark tabular-nums">
                {stats.lastRun.pacePerKm}/km
              </span>
            </span>
            <span className="text-gray dark:text-gray truncate max-w-full">
              &ldquo;{stats.lastRun.name}&rdquo;
            </span>
          </div>
        )}
        </div>
        )}

        {/* Personal records card */}
        <PersonalRecords />
      </div>
    </section>
  );
};

export default OnTheRun;
