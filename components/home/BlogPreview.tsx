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
            <div className="hidden md:block">
              <PillButton href="/blog" arrow>All Posts</PillButton>
            </div>
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
          <PillButton href="/blog" arrow>All Posts</PillButton>
        </div>
      </div>
    </section>
  );
}
