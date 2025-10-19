import { getBlogPosts, getFeaturedBlogPosts } from "@/sanity/sanity.fetch";
import Transition from "@/components/shared/Transition";
import NewsletterBanner from "@/components/shared/NewsletterBanner";
import { Metadata } from "next";
import siteMetadata from "@/utils/siteMetaData";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest thoughts on web development, technology, and career insights.",
  alternates: {
    canonical: `${siteMetadata.siteUrl}/blog`,
  },
};

export default async function BlogPage() {
  const [blogPosts, featuredPosts] = await Promise.all([
    getBlogPosts(),
    getFeaturedBlogPosts(),
  ]);

  return (
    <Transition>
      <BlogPageClient
        initialBlogPosts={blogPosts}
        initialFeaturedPosts={featuredPosts}
      />
      <NewsletterBanner />
    </Transition>
  );
}