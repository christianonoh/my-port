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

// export interface JobType extends Base {
//   jobTitle: string;
//   companyName: string;
//   startDate: Date | string;
//   endDate?: Date;
//   description: PortableTextBlock[];
//   url?: string;
//   companyLogo: string;
//   location: string;
//   skills: string[];
// }

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
  slug: string;
  logo?: any;
}

export interface WorkDetailsType extends Base {
  position: string;
  description: PortableTextBlock[];
  companyName: string;
  companyLogo?: string;
  companyUrl?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  technologies?: any;
}
export interface EducationDetailsType extends Base {
  discipline: string;
  description: PortableTextBlock[];
  schoolName: string;
  schoolLogo?: string;
  schoolUrl?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  skills?: any;
}
