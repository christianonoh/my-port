import 'server-only';

import { ProfileType } from '@/types/profileType';
import { JobType } from '@/types/jobType';
import { ProjectType } from '@/types/projectType';
import { profileGroq, jobsGroq, projectsGroq, projectGroq } from './sanity.queries';
import type {QueryParams} from '@sanity/client';
import {draftMode} from 'next/headers';
import { client } from './sanity.client';


const DEFAULT_PARAMS = {} as QueryParams
const DEFAULT_TAGS = [] as string[]

export const token = process.env.SANITY_API_READ_TOKEN;

const sanityFetch = async <QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string
  params?: QueryParams
  tags: string[]
}): Promise<QueryResponse> => {
  const isDraftMode = draftMode().isEnabled
  if (isDraftMode && !token) {
    throw new Error('The `SANITY_API_READ_TOKEN` environment variable is required.')
  }

  const REVALIDATE_SKIP_CACHE = 0
  const REVALIDATE_CACHE_FOREVER = false

  return client.fetch<QueryResponse>(query, params, {
    ...(isDraftMode && {
      token: token,
      perspective: 'previewDrafts',
    }),
    next: {
      //revalidate: 30, // for simple, time-based revalidation
      revalidate: isDraftMode ? REVALIDATE_SKIP_CACHE : REVALIDATE_CACHE_FOREVER,
      tags, // for tag-based revalidation
    },
  })
}

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
  });
}

// Get all projects 
export const getJobs = () => {
  return sanityFetch<JobType[] | []>({
    query: jobsGroq,
    tags: ['job', 'profile'],
  })
}
// Get all projects 
export const getProfile = () => {
  return sanityFetch<ProfileType[] | []>({
    query: profileGroq,
    tags: ['profile', 'job'],
  })
}