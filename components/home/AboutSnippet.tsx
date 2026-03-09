"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { ProfileType } from "@/types";
import PillButton from "../shared/PillButton";

// ── Animated Counter ─────────────────────────────────────────────────
interface MetricProps {
  value: number;
  label: string;
  suffix?: string;
}

function AnimatedCounter({ value, label, suffix = "" }: MetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const steps = 40;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-outfit text-accent tabular-nums">
        {count}
        {suffix}
      </div>
      <p className="text-sm text-gray mt-1.5 font-medium">{label}</p>
    </div>
  );
}

// ── About Snippet ────────────────────────────────────────────────────
interface AboutSnippetProps {
  profile: ProfileType;
  projectCount: number;
  blogCount: number;
  yearsExperience?: number;
}

export default function AboutSnippet({
  profile,
  projectCount,
  blogCount,
  yearsExperience = 4,
}: AboutSnippetProps) {
  return (
    <section data-section="about" className="py-20 lg:py-28">
      <ScrollReveal>
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit uppercase text-dark dark:text-light mb-6 leading-[1.05]">
          About Me
        </h2>

        {/* Bio */}
        <p className="text-gray leading-relaxed text-lg mb-12 max-w-lg">
          {profile.shortBio}
        </p>

        {/* Stats — separated by a top border for structure */}
        <div className="grid grid-cols-3 gap-6 sm:gap-10 mb-12 pt-8 border-t border-dark/[0.06] dark:border-light/[0.06]">
          <AnimatedCounter
            value={yearsExperience}
            suffix="+"
            label="Years of Experience"
          />
          <AnimatedCounter
            value={projectCount + 14}
            suffix="+"
            label="Completed Projects"
          />
          <AnimatedCounter value={blogCount} label="Blog Posts" />
        </div>

        {/* Email + Socials */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 mb-12">
          {/* Email */}
          <a
            href={`mailto:${profile.email}`}
            className="group flex items-center gap-3 text-sm"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/[0.08] dark:bg-accent/[0.12] text-accent shrink-0 transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 5l7 5 7-5M3 5v10h14V5H3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-gray group-hover:text-dark dark:group-hover:text-light transition-colors duration-300">
              {profile.email}
            </span>
          </a>

          {/* Divider */}
          <span className="hidden sm:block w-px h-6 bg-dark/[0.08] dark:bg-light/[0.08]" />

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {Object.entries(profile.socialLinks)
              .sort()
              .map(([key, value]) => (
                <a
                  key={key}
                  href={value}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={`Connect on ${key}`}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-dark/[0.08] dark:border-light/[0.08] text-gray hover:border-accent hover:text-accent hover:bg-accent/[0.04] dark:hover:bg-accent/[0.06] transition-all duration-300"
                >
                  <i className={`fa-brands fa-${key} text-base`} />
                </a>
              ))}
          </div>
        </div>

        {/* CTA */}
        <PillButton href="/about" arrow>
          My Story
        </PillButton>
      </ScrollReveal>
    </section>
  );
}