import { createClient, type ClientConfig } from "@sanity/client"

const config: ClientConfig = {
  "projectId": "n5aosvhy",
  "dataset": "production",
  "apiVersion": "2023-10-06"
}

const sanityClient = createClient(config);

export default sanityClient;
