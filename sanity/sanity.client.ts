import { createClient, type ClientConfig } from "@sanity/client";
import { dataset, projectId, apiVersion, revalidateSecret } from "./sanity.api";

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "development" ? true : false,
  perspective: "published",
};

const client = createClient(config);

// Create a client with write permissions for API routes
const writeClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_WR_TOKEN,
});

// Create a client for draft mode that can access unpublished documents
const draftClient = createClient({
  ...config,
  useCdn: false,
  perspective: "previewDrafts",
  token: process.env.SANITY_API_WR_TOKEN,
});

export { client, writeClient, draftClient };
