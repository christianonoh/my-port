"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { ProfileType } from "@/types";
import { ArrowRight } from "lucide-react";

interface AboutSnippetProps {
  profile: ProfileType;
}

export default function AboutSnippet({ profile }: AboutSnippetProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Portrait */}
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-dark/20 rounded-2xl blur-2xl -z-10" />
              <Image
                src={profile.profileImage.image.url}
                alt={profile.profileImage.alt}
                width={400}
                height={500}
                placeholder="blur"
                blurDataURL={profile.profileImage.image.metadata.lqip}
                className="rounded-2xl object-cover object-top w-full max-h-[500px] border-2 border-accent/10"
              />
            </div>

            {/* Bio */}
            <div>
              <p className="text-accent font-medium mb-3 font-outfit tracking-wide">
                About Me
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark mb-6">
                Get to Know Me
              </h2>
              <p className="text-gray-dark dark:text-gray leading-relaxed text-lg mb-8">
                {profile.shortBio}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors duration-300 font-medium"
              >
                Read More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
