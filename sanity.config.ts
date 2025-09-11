import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./sanity/schemas";
import { myTheme } from "./theme";
import StudioNavbar from "./components/shared/StudioNavbar";
import Logo from "./components/shared/Logo";
import { Iframe, IframeOptions } from "sanity-plugin-iframe-pane";
import {
  apiVersion,
  dataset,
  previewSecretId,
  projectId,
} from "@/sanity/sanity.api";

export const PREVIEWABLE_DOCUMENT_TYPES = [
  schemaTypes[0].name,
  schemaTypes[1].name,
  schemaTypes[2].name,
] satisfies string[];

export const PREVIEWABLE_DOCUMENT_TYPES_REQUIRING_SLUGS = [
  schemaTypes[2].name,
] satisfies typeof PREVIEWABLE_DOCUMENT_TYPES;

// Used to generate URLs for drafts and live previews
export const PREVIEW_BASE_URL = "/api/draft";

// URL resolver function for the iframe preview
export const urlResolver = (document: any) => {
  if (!document?._type) return undefined;
  
  const slug = document.slug?.current;
  if (PREVIEWABLE_DOCUMENT_TYPES_REQUIRING_SLUGS.includes(document._type) && !slug) {
    return new Error('Missing slug');
  }
  
  return `${PREVIEW_BASE_URL}?type=${document._type}&slug=${slug || ''}&secret=PLACEHOLDER`;
};

export const iframeOptions = {
  url: urlResolver,
} satisfies IframeOptions;

const config = defineConfig({
  name: "default",
  title: "My Portfolio",
  projectId: projectId || "",
  dataset: dataset || "",
  basePath: "/studio",
  plugins: [
    deskTool({
      // structure: pageStructure([home, settings]),
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      // You can add any React component to `S.view.component` and it will be rendered in the pane
      // and have access to content in the form in real-time.
      // It's part of the Studio's “Structure Builder API” and is documented here:
      // https://www.sanity.io/docs/structure-builder-reference
      defaultDocumentNode: (S: any, { schemaType }: any) => {
        if ((PREVIEWABLE_DOCUMENT_TYPES as string[]).includes(schemaType)) {
          return S.document().views([
            // Default form view
            S.view.form(),
            // Preview
            S.view.component(Iframe).options(iframeOptions).title("Preview"),
          ]);
        }

        return null;
      },
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    // singletonPlugin([home.name, settings.name]),
    // Preview URL action - temporarily removed for migration
    codeInput(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
  theme: myTheme,
  studio: {
    components: {
      logo: Logo,
      navbar: StudioNavbar,
    },
  },
});

export default config;
