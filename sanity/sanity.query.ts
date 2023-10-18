import { groq } from 'next-sanity';
import { ProfileType } from '@/types/profileType';
import sanityClient from "./sanity.client";
import { JobType } from '@/types/jobType';

export const getProfile = async (): Promise<ProfileType[]> => {
  return sanityClient.fetch(
    groq`*[_type == "profile"]{
      _id,
      fullName,
      headline,
      profileImage {alt, "image": asset->url},
      shortBio,
      location,
      fullBio,
      email,
      "resumeURL": resumeURL.asset->url,
      socialLinks,
      skills
    }
  `);
}

export const getJobs = async (): Promise<JobType[]> => {
  return sanityClient.fetch(
    groq`*[_type == "job"]{
      _id,
      companyName,
      startDate,
      endDate,
      description,
      "companyLogo": companyLogo.asset->url,
      skills
    }`
  );
}
