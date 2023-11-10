import { createClient, type ClientConfig } from "@sanity/client"
import type {QueryParams} from '@sanity/client'

const config: ClientConfig = {
  "projectId": "n5aosvhy",
  "dataset": "production",
  "apiVersion": "2023-10-06",
  useCdn: false,
}

const sanityClient = createClient(config);

const DEFAULT_PARAMS = {} as QueryParams
const DEFAULT_TAGS = [] as string[]

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string
  params?: QueryParams
  tags: string[]
}): Promise<QueryResponse> {
  return sanityClient.fetch<QueryResponse>(query, params, {
    cache: 'force-cache',
    next: {
      //revalidate: 30, // for simple, time-based revalidation
      tags, // for tag-based revalidation
    },
  })
}

export default sanityClient;
