import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { table } from "@sanity/table";
import { schemaTypes } from "./sanity/schemas";
import { myTheme } from "./theme";
import StudioNavbar from "./components/shared/StudioNavbar";
import Logo from "./components/shared/Logo";
import { Iframe, IframeOptions } from "sanity-plugin-iframe-pane";
import { PreviewNewsletterAction, SendNewsletterAction } from "./sanity/actions/SendNewsletterAction";
import {
  apiVersion,
  dataset,
  projectId,
} from "@/sanity/sanity.api";

export const PREVIEWABLE_DOCUMENT_TYPES = [
  'profile',
  'work',
  'project',
  'blogPost',
] satisfies string[];

export const PREVIEWABLE_DOCUMENT_TYPES_REQUIRING_SLUGS = [
  'project',
  'blogPost',
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

  const secret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || 'eWII6Cce1f001OF3m6mrBIGZ5pSoaWfZvxf0ViJHmsYxdtcALic8MFGNevudOJoUIXAXwUefBun1uB1744KS8';

  const params = new URLSearchParams();
  params.set('type', document._type);
  params.set('secret', secret);
  if (slug) params.set('slug', slug);

  return `${PREVIEW_BASE_URL}?${params.toString()}`;
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
    codeInput(),
    table(),
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
  document: {
    actions: (prev, context) => {
      // Add custom preview and send actions for newsletter documents
      if (context.schemaType === 'newsletter') {
        return [...prev, PreviewNewsletterAction, SendNewsletterAction];
      }
      return prev;
    },
  },
});

export default config;
