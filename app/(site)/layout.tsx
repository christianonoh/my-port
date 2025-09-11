import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Rubik, Outfit } from "next/font/google";
import Footer from "../../components/shared/Footer";
import Navbar from "../../components/shared/Navbar";
import { draftMode } from "next/headers";
import { token } from "@/sanity/sanity.fetch";
import dynamic from "next/dynamic";
import { PreviewBanner } from "@/components/preview/PreviewBanner";
import siteMetadata from "@/utils/siteMetaData";
import Script from "next/script";
import ContactMe from "@/components/shared/ContactMe";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

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

export const viewport: Viewport = {
  themeColor: "#5D3587",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDraftMode = (await draftMode()).isEnabled;
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.className} ${rubik.variable} ${outfit.variable} dark:bg-dark relative bg-light dark:text-light text-gray-dark flex text-base lg:text-base flex-col min-h-screen`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <Script
            async
            src="https://burgeranalytics.vercel.app/script.js"
            data-website-id="d7d729ea-39c0-4b64-a9c9-f0d835c05b20"
          />
          {isDraftMode && <PreviewBanner />}
          <Navbar />
          {isDraftMode ? (
            <PreviewProvider token={token!}>{children}</PreviewProvider>
          ) : (
            children
          )}
          <ContactMe />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
