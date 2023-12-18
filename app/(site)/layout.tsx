import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../../components/shared/Footer";
import Navbar from "../../components/shared/Navbar";
import Head from "../../components/shared/Head";
import { draftMode } from "next/headers";
import { token } from "@/sanity/sanity.fetch";
import dynamic from "next/dynamic";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import siteMetadata from "@/utils/siteMetaData";

const inter = Inter({ subsets: ["latin"] });

type MyMetadata = Metadata & {
  url: string;
};

export const metadata: MyMetadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: `${siteMetadata.title} | Software Developer`, // a default is required when creating a template
  },
  description: siteMetadata.description,
  authors: { name: siteMetadata.author },
  url: siteMetadata.siteUrl,

  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 800,
        height: 600,
      },
      {
        url: siteMetadata.socialBanner,
        width: 1800,
        height: 1600,
        alt: "Christian Onoh",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    images: [siteMetadata.socialBanner],
  },
};

const PreviewProvider = dynamic(
  () => import("@/components/preview/PreviewProvider")
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDraftMode = draftMode().isEnabled;
  return (
    <html lang="en">
      <Head />
      <body
        className={`${inter.className} dark:bg-dark relative bg-light dark:text-light text-gray-dark flex text-base sm:text-lg flex-col min-h-screen`}
      >
        {isDraftMode && <PreviewBanner />}
        <Navbar />
        {isDraftMode ? (
          <PreviewProvider token={token!}>{children}</PreviewProvider>
        ) : (
          children
        )}
        <Footer />
      </body>
    </html>
  );
}
