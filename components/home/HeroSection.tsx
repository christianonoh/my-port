"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ProfileType } from "@/types";

interface HeroSectionProps {
  profile: ProfileType;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Word-by-word staggered headline reveal
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !headlineRef.current) return;

    const words = headlineRef.current.querySelectorAll(".hero-word-inner");
    gsap.set(words, { y: "100%", opacity: 0 });
    gsap.to(words, {
      y: "0%",
      opacity: 1,
      stagger: 0.04,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out",
    });
  }, []);

  // Split headline into words for staggered reveal
  const headlineWords = profile.headline.split(" ");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="w-full">
        <div className="flex flex-col items-center lg:items-start gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1
              ref={headlineRef}
              className="text-4xl md:text-5xl lg:text-7xl font-bold font-outfit leading-tight mb-6 dark:text-light text-dark"
            >
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden mr-[0.25em] last:mr-0"
                >
                  <span className="hero-word-inner inline-block">
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-dark dark:text-gray leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {profile.shortBio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              {Object.entries(profile.socialLinks)
                .sort()
                .map(([key, value]) => (
                  <a
                    key={key}
                    href={value}
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={`Connect on ${key}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-light dark:border-gray-dark hover:border-accent dark:hover:border-accent transition-colors duration-300 text-sm font-medium"
                  >
                    <i className={`fa-brands fa-${key} text-accent`} />
                    {key[0].toUpperCase() + key.toLowerCase().slice(1)}
                  </a>
                ))}
            </motion.div>
          </div>

          {/* Profile Image - mobile only (floating image handles desktop) */}
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src={profile.profileImage.image.url}
                  alt={profile.profileImage.alt}
                  width={400}
                  height={400}
                  priority
                  placeholder="blur"
                  blurDataURL={profile.profileImage.image.metadata.lqip}
                  className="relative rounded-2xl object-cover object-top w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
