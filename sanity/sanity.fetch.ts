import "server-only";

import {
  profileGroq,
  worksGroq,
  projectsGroq,
  projectGroq,
  technologiesGroq,
  educationGroq,
  skillsGroq,
  mediaGroq,
  blogPostsGroq,
  featuredBlogPostsGroq,
  blogPostGroq,
  subscribersGroq,
  activeSubscribersGroq,
} from "./sanity.queries";
import type { QueryParams } from "@sanity/client";
import { client, draftClient } from "./sanity.client";
import { draftMode } from "next/headers";
import { ProfileType, ProjectType, WorkDetailsType } from "@/types";

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export const token = process.env.SANITY_API_READ_TOKEN;

export const sanityFetch = async <QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<QueryResponse> => {
  return client.fetch<QueryResponse>(query, params, {
    cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    next: { tags },
  });
};

// Function to check if we're in draft mode safely
export const sanityFetchWithDraftMode = async <QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<QueryResponse> => {
  let isDraftMode = false;
  try {
    isDraftMode = (await draftMode()).isEnabled;
  } catch (error) {
    // If draftMode() fails, we're not in a request context, so use regular client
    isDraftMode = false;
  }
  
  const sanityClient = isDraftMode ? draftClient : client;
  
  return sanityClient.fetch<QueryResponse>(query, params, {
    cache: isDraftMode || process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    next: { tags },
  });
};

//  SANITY FETCH FUNCTIONS

// Get all projects
export const getProjects = () => {
  return sanityFetchWithDraftMode<ProjectType[] | null>({
    query: projectsGroq,
    tags: ["project"],
  });
};

// Get single project
export const getProject = (slug: string) => {
  return sanityFetchWithDraftMode<ProjectType>({
    query: projectGroq,
    params: { slug },
    tags: ["project"],
  });
};

// Get all projects
export const getWorks = () => {
  return sanityFetchWithDraftMode<WorkDetailsType[] | null>({
    query: worksGroq,
    tags: ["work"],
  });
};
// Get all projects
export const getProfile = () => {
  return sanityFetchWithDraftMode<ProfileType[] | null>({
    query: profileGroq,
    tags: ["profile"],
  });
};

// Get all Technologies
export const getTechnologies = () => {
  return sanityFetch<any[] | null>({
    query: technologiesGroq,
    tags: ["technology"],
  });
};

// Get all Skills
export const getSkills = () => {
  return sanityFetch<any[] | null>({
    query: skillsGroq,
    tags: ["skill"],
  });
};

// Get all Educations
export const getEducations = () => {
  return sanityFetch<any[] | null>({
    query: educationGroq,
    tags: ["education"],
  });
};

// Get single media
export const getMedia = (slug: string) => {
  return sanityFetch<any>({
    query: mediaGroq,
    params: { slug },
    tags: ["media"],
  });
};

// Get all blog posts
export const getBlogPosts = () => {
  return sanityFetch<any[] | null>({
    query: blogPostsGroq,
    tags: ["blogPost"],
  });
};

// Get featured blog posts
export const getFeaturedBlogPosts = () => {
  return sanityFetch<any[] | null>({
    query: featuredBlogPostsGroq,
    tags: ["blogPost"],
  });
};

// Get single blog post
export const getBlogPost = (slug: string) => {
  return sanityFetchWithDraftMode<any>({
    query: blogPostGroq,
    params: { slug },
    tags: ["blogPost"],
  });
};

// Get all subscribers
export const getSubscribers = () => {
  return sanityFetch<any[] | null>({
    query: subscribersGroq,
    tags: ["subscriber"],
  });
};

// Get active subscribers
export const getActiveSubscribers = () => {
  return sanityFetch<any[] | null>({
    query: activeSubscribersGroq,
    tags: ["subscriber"],
  });
};
