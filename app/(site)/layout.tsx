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

const inter = Inter({ subsets: ["latin"] });

type MyMetadata = Metadata & {
  image: string;
  url: string;
};

export const metadata: MyMetadata = {
  title: "Christian Onoh - Portfolio",
  description:
    "Christian Onoh is a full-stack developer with experience in JavaScript, React, Ruby on Rails, Node.js, and more. Check out his portfolio to see his work!",
  authors: [{ name: "Christian Onoh" }],
  metadataBase: new URL("https://christianonoh.vercel.app"),
  keywords:
    "portfolio, full-stack developer, React, Node.js, Ruby, Ruby on Rails, Next.js, front-end developer, back-end developer, software engineer",
  image:
    "https://cdn.sanity.io/images/n5aosvhy/production/0b4eb353efbd838adcbaaea22e49369eeeef6cd3-2019x2560.png",
  url: "https://github.com/christianonoh",
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
        className={`${inter.className} dark:bg-dark relative bg-light dark:text-white text-gray-dark flex text-base sm:text-lg flex-col min-h-screen`}
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
