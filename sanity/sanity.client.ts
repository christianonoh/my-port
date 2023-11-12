import { createClient, type ClientConfig } from "@sanity/client";
import { dataset, projectId, apiVersion, revalidateSecret } from './sanity.api';

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: revalidateSecret ? false : true,
  perspective: 'published',
}

const client = createClient(config);

export { client };
