"use client";

import { useTransition } from "react";
import AnimatedText from "@/components/shared/AnimatedText";
import BlogCard from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import PullToRefresh from "@/components/shared/PullToRefresh";
import { useRouter } from "next/navigation";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: {
    alt: string;
    image: any;
  };
  category?: string;
  tags?: string[];
  publishedAt: string;
  readingTime?: number;
  featured?: boolean;
}

interface BlogPageClientProps {
  initialBlogPosts: BlogPost[] | null;
  initialFeaturedPosts: BlogPost[] | null;
}

export default function BlogPageClient({
  initialBlogPosts,
  initialFeaturedPosts,
}: BlogPageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    // Small delay to show the refresh animation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Refresh the page data
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} enabled={true}>
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:px-20 py-8 md:py-16">
        {/* Hero Section */}
        <div className="mb-12 md:mb-16 text-left md:text-left">
          <AnimatedText
            text="My Blog"
            className="!text-4xl md:!text-6xl lg:!text-7xl mb-6 md:mb-8"
          />
          <div className="max-w-3xl mx-auto md:mx-0">
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Sharing insights, tutorials, and thoughts on web development, technology, and my journey as a developer.
            </p>

            {/* Blog stats */}
            <div className="flex flex-wrap items-center md:justify-start gap-4 md:gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <i className="fa-solid fa-file-lines" />
                <span>{initialBlogPosts?.length || 0} Articles</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fa-solid fa-user" />
                <span>Written by Christian Onoh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts Section */}
        {initialFeaturedPosts && initialFeaturedPosts.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-light">
                <i className="fa-solid fa-star" />&nbsp; Featured Posts
              </h2>
              <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                {initialFeaturedPosts.length} featured article
                {initialFeaturedPosts.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {initialFeaturedPosts.map((post) => (
                <FeaturedBlogCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Main Content Section */}
        <section>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-light">
              <i className="fa-solid fa-book" />&nbsp; All Articles
            </h2>
            <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
              Latest posts
            </div>
          </div>

          {initialBlogPosts && initialBlogPosts.length > 0 ? (
            <div className="space-y-6 md:space-y-0 grid md:grid-cols-2 md:gap-8">
              {initialBlogPosts.map((post, index) => (
                <div key={post._id}>
                  <BlogCard post={post} featured={index === 0} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  I&apos;m working on some great content. Check back soon for new articles!
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </PullToRefresh>
  );
}
