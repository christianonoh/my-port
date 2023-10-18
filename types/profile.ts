import { PortableTextBlock } from "sanity";

export type Profile = {
  _id: string,
  fullName: string,
  headline: string,
  profileImage: {
    alt: string,
    image: string,
  },
  shortBio: string,
  email: string,
  location: string,
  fullBio: PortableTextBlock[],
  resumeURL: string,
  socialLinks: string[],
  skills: string[],
}