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
} from "./sanity.queries";
import type { QueryParams } from "@sanity/client";
import { draftMode } from "next/headers";
import { client } from "./sanity.client";
import { revalidateSecret } from "./sanity.api";
import { ProfileType, ProjectType, WorkDetailsType } from "@/types";

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export const token = process.env.SANITY_API_READ_TOKEN;

const sanityFetch = async <QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<QueryResponse> => {
  const isDraftMode = draftMode().isEnabled;
  if (isDraftMode && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required."
    );
  }

  // @TODO this won't be necessary after https://github.com/sanity-io/client/pull/299 lands
  const sanityClient =
    client.config().useCdn && isDraftMode
      ? client.withConfig({ useCdn: true })
      : client;

  return sanityClient.fetch<QueryResponse>(query, params, {
    // We only cache if there's a revalidation webhook setup
    cache: revalidateSecret ? "force-cache" : "no-store",
    // cache: "no-store",
    ...(isDraftMode && {
      cache: undefined,
      token: token,
      perspective: "previewDrafts",
    }),
    next: {
      ...(isDraftMode && { revalidate: 30 }),
      tags, // for tag-based revalidation
    },
  });
};

//  SANITY FETCH QUERIES

// Get all projects
export const getProjects = () => {
  return sanityFetch<ProjectType[] | null>({
    query: projectsGroq,
    tags: ["project"],
  });
};

// Get single project
export const getProject = (slug: string) => {
  return sanityFetch<ProjectType>({
    query: projectGroq,
    params: { slug },
    tags: ["project"],
  });
};

// Get all projects
export const getJobs = () => {
  return sanityFetch<WorkDetailsType[] | null>({
    query: worksGroq,
    tags: ["job", "profile"],
  });
};
// Get all projects
export const getProfile = () => {
  return sanityFetch<ProfileType[] | null>({
    query: profileGroq,
    tags: ["profile", "job"],
  });
};

// Get all Technologies
export const getTechnologies = () => {
  return sanityFetch<any[] | null>({
    query: technologiesGroq,
    tags: ["technology"],
  });
};

// Get all Technologies
export const getSkills = () => {
  return sanityFetch<any[] | null>({
    query: skillsGroq,
    tags: ["technology"],
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
