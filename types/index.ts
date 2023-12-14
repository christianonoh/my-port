import { PortableTextBlock } from "sanity";

type Base = {
  _id: string;
};
export interface ProfileType extends Base {
  fullName: string;
  headline: string;
  profileImage: {
    alt: string;
    image: any;
  };
  shortBio: string;
  email: string;
  location: string;
  fullBio: PortableTextBlock[];
  resumeURL: string;
  socialLinks: string[];
  skills: string[];
}

export interface JobType extends Base {
  jobTitle: string;
  companyName: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  url?: string;
  companyLogo: string;
  location: string;
  skills: string[];
}

export interface ProjectType extends Base {
  title: string;
  tagline: string;
  slug: string;
  logo: string;
  projectUrl: string;
  coverImage: any;
  description: PortableTextBlock[];
  technologies?: any;
}

export interface TechnologyType extends Base {
  title: string;
  description: string;
}
