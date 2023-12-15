import { compareDesc, parseISO, format } from "date-fns";

export const formatDate = (
  date: string,
  dateFormat = "MMMM dd, yyyy" as string
) => {
  return format(parseISO(date), dateFormat);
};

export const siteMetadata = {
  title: "Christian Onoh - Fullstack Developer Portfolio",
  author: "Christian Onoh",
  headerTitle: "Christian Onoh - Portfolio",
  position: "Fullstack Developer",
  description:
    "Explore the portfolio of Christian Onoh, a fullstack developer using Next.js, Tailwind.css, and more.",
  language: "en-us",
  theme: "system", // system, dark, or light
  siteUrl: "https://christianonoh.vercel.app", // Update to your actual domain
  siteLogo: "/images/logo.svg",
  socialBanner: "/images/social_media_banner.png", // add social banner in the public folder
  email: "chibyk5000@gmail.com",
  github: "https://github.com/christianonoh",
  twitter: "https://twitter.com/christianonoh",
  linkedin: "https://www.linkedin.com/in/christianonoh/",
  // Add other social media links as needed
  locale: "en-US",
};
