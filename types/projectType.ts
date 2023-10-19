import { PortableTextBlock } from "sanity";

export type ProjectType = {
  _id: string;
  title: string;
  tagline: string;
  slug: string;
  logo: string;
  projectUrl: string;
  coverImage: {
    alt: string;
    image: string;
  },
  description: PortableTextBlock[];
}