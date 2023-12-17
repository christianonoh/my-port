import { compareDesc, parseISO, format } from "date-fns";

export const formatDate = (
  date: string,
  dateFormat = "MMMM dd, yyyy" as string
) => {
  return format(parseISO(date), dateFormat);
};

export const cx = (...classNames: any) => classNames.filter(Boolean).join(" ");
