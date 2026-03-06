"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";

interface BlogPreviewProps {
  posts: any[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <p className="text-accent font-medium mb-3 font-outfit tracking-wide">
                Blog
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark">
                Latest Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-2 text-accent hover:text-accent-dark dark:hover:text-accent-light transition-colors duration-300 font-medium"
            >
              Read All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <StaggerItem key={post._id}>
              <FeaturedBlogCard post={post} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors duration-300 font-medium"
          >
            Read All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
