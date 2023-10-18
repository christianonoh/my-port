export type JobType = {
  _id: string;
  jobTitle: string;
  companyName: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  url?: string;
  companyLogo: string;
  location: string;
  skills: string[];
};
