"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import PillButton from "../shared/PillButton";

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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark">
              Latest Articles
            </h2>
            {/* <Link
              href="/blog"
              className="group relative inline-flex items-center gap-1 sm:gap-3 px-4 sm:px-10 py-2 sm:py-4 rounded-full border border-accent text-accent-dark font-semibold text-sm uppercase tracking-[0.15em] font-outfit transition-all duration-500 hover:bg-accent-dark hover:text-[#111] hover:border-accent-glow hover:shadow-[0_0_30px_rgba(212,245,60,0.08)]"
            >
              All Posts
              <ArrowRight className="w-4 h-4" />
            </Link> */}

            <PillButton href="/blog" arrow>All Posts</PillButton>
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
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full border border-accent text-accent-dark font-semibold text-sm uppercase tracking-[0.15em] font-outfit transition-all duration-500 hover:bg-accent-dark hover:text-[#111] hover:border-accent-glow hover:shadow-[0_0_30px_rgba(212,245,60,0.08)]"
          >
            All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
