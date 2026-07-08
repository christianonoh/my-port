import { BiTrophy, BiTargetLock } from "react-icons/bi";
import { personalRecords } from "@/lib/personalRecords";

const PersonalRecords = () => {
  return (
    <div className="rounded-2xl border border-gray-light dark:border-gray-dark p-6 sm:p-8 dark:bg-dark/40 bg-light/60 shadow-sm dark:shadow-light/5">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gray dark:text-gray">
        <BiTrophy className="h-4 w-4 text-accent" />
        Personal records
      </div>

      {/* Records */}
      <ul className="mt-4 divide-y divide-gray-light dark:divide-gray-dark">
        {personalRecords.map((record) => (
          <li
            key={record.label}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div>
              <p className="font-medium dark:text-light text-dark">
                {record.label}
              </p>
              <p className="text-xs text-gray dark:text-gray">{record.meta}</p>
            </div>

            {record.time ? (
              <span className="text-2xl font-semibold tabular-nums dark:text-light text-dark">
                {record.time}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent/50 px-3 py-1 text-xs font-medium text-accent">
                <BiTargetLock className="h-3.5 w-3.5" aria-hidden="true" />
                Goal · {record.goal}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalRecords;
