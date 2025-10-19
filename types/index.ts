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

export interface ProjectType extends Base {
  title: string;
  tagline: string;
  slug: string;
  logo: string;
  stack: any[];
  summary: PortableTextBlock[];
  projectUrl?: string;
  githubUrl?: string;
  coverImage: any;
  milestone?: PortableTextBlock[];
  features?: PortableTextBlock[];
  problemStatement?: PortableTextBlock[];
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

export interface SubscriberType extends Base {
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'pending';
  subscribedAt: string;
  unsubscribedAt?: string;
  source?: string;
}

export interface BlogPostType extends Base {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: {
    alt: string;
    image: any;
  };
  contentType: 'richtext' | 'markdown';
  content?: PortableTextBlock[];
  markdownContent?: string;
  category?: string;
  tags?: string[];
  publishedAt: string;
  featured?: boolean;
  readingTime?: number;
}
