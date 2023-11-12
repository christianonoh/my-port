import { createClient, type ClientConfig } from "@sanity/client";
import { dataset, projectId, apiVersion, revalidateSecret } from './sanity.api';

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  // useCdn: revalidateSecret ? false : true,
  useCdn: true,
  perspective: 'published',
}

const client = createClient(config);

export { client };
