import { compareDesc, parseISO, format } from "date-fns";

export const formatDate = (
  date: string,
  dateFormat = "MMMM dd, yyyy" as string
) => {
  return format(parseISO(date), dateFormat);
};

export const cx = (...classNames: any) => classNames.filter(Boolean).join(" ");

export const glassClasses =
  "bg-light/70 dark:bg-dark/70 backdrop-blur-xl backdrop-saturate-150 border border-dark/[0.08] dark:border-light/[0.08]";
export const glassShadow =
  "shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)]";
