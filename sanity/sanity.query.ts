import { ProfileType } from '@/types/profileType';
import { sanityFetch } from "./sanity.client";
import { JobType } from '@/types/jobType';
import { ProjectType } from '@/types/projectType';


// GROQ Queries for Sanity
const profileGroq = `
    *[_type == "profile"]{
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
`;

const jobsGroq = `
  *[_type == "job"]{
    _id,
    companyName,
    jobTitle,
    startDate,
    endDate,
    description,
    "companyLogo": companyLogo.asset->url,
    skills
  }
`;

const projectsGroq = `*[_type == "project"]{
    _id,
    title,
    tagline,
    "slug": slug.current,
    "logo": logo.asset->url,
    projectUrl,
    "coverImage": coverImage.asset->url,
    description
  }`;

const projectGroq = `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    tagline,
    "logo": logo.asset->url,
    projectUrl,
    coverImage { alt, "image": asset->url },
    description
  }`;


//  SANITY FETCH QUERIES

// Get all projects 
export const getProjects = () => {
  return sanityFetch<ProjectType[] | []>({
    query: projectsGroq,
    tags: ['project'],
  })
}

// Get single project
export const getProject = (slug: string) => {
  return sanityFetch<ProjectType>({
    query: projectGroq,
    params: { slug },
    tags: [`project:${slug}`],
  })
}

// Get all projects 
export const getJobs = () => {
  return sanityFetch<JobType[] | []>({
    query: jobsGroq,
    tags: ['job'],
  })
}
// Get all projects 
export const getProfile = () => {
  return sanityFetch<ProfileType[] | []>({
    query: profileGroq,
    tags: ['profile'],
  })
}