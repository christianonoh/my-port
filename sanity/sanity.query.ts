import { groq } from 'next-sanity';
import { ProfileType } from '@/types/profileType';
import sanityClient, { sanityFetch } from "./sanity.client";
import { JobType } from '@/types/jobType';
import { ProjectType } from '@/types/projectType';

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
      jobTitle,
      startDate,
      endDate,
      description,
      "companyLogo": companyLogo.asset->url,
      skills
    }`
  );
}

export const getProjects = async (): Promise<ProjectType[]> => {
  return sanityClient.fetch(
    groq`*[_type == "project"]{
      _id,
      title,
      tagline,
      "slug": slug.current,
      "logo": logo.asset->url,
      projectUrl,
      "coverImage": coverImage.asset->url,
      description
    }`,
  );
}

export const projectsGroq = `*[_type == "project"]{
  _id,
  title,
  tagline,
  "slug": slug.current,
  "logo": logo.asset->url,
  projectUrl,
  "coverImage": coverImage.asset->url,
  description
}`


export const getProject = async (slug: string) => {
  return sanityClient.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]{
      _id,
      title,
      tagline,
      "logo": logo.asset->url,
      projectUrl,
      coverImage { alt, "image": asset->url },
      description
    }`,
    { slug }
  );
}
