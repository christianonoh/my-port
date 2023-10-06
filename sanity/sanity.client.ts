import { createClient } from "@sanity/client"

const clientConfig = {
  "projectId": "n5aosvhy",
  "dataset": "production",
  "apiVersion": "2023-10-06"
}

const sanityClient = createClient(clientConfig);

export default sanityClient;
