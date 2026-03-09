"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { ProfileType } from "@/types";

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
    <div ref={ref} className="text-left">
      <div className="text-4xl md:text-5xl font-bold font-outfit text-accent">
        {count}
        {suffix}
      </div>
      <p className="text-sm text-gray-dark dark:text-gray mt-1 font-medium">
        {label}
      </p>
    </div>
  );
}

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
    <section data-section="about" className="py-20 lg:py-24">
      <div>
        <ScrollReveal>
          <div>
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit uppercase dark:text-light text-dark mb-6">
                About Me
              </h2>
              <p className="text-gray-dark dark:text-gray leading-relaxed text-lg mb-10">
                {profile.shortBio}
              </p>

              {/* Stats Row */}
              <div className="flex gap-12 mb-10">
                <AnimatedCounter value={yearsExperience} suffix="+" label="Years of Experience" />
                <AnimatedCounter value={projectCount + 14} suffix="+" label="Completed Projects" />
                <AnimatedCounter value={blogCount} label="Blog Posts" />
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-8 mb-8">
                <div>
                  <span className="font-semibold dark:text-light text-dark">Email : </span>
                  <span className="text-gray-dark dark:text-gray">{profile.email}</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mb-10">
                {Object.entries(profile.socialLinks)
                  .sort()
                  .map(([key, value]) => (
                    <a
                      key={key}
                      href={value}
                      rel="noopener noreferrer"
                      target="_blank"
                      aria-label={`Connect on ${key}`}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-light dark:border-gray-dark hover:border-accent dark:hover:border-accent hover:text-accent transition-colors duration-300"
                    >
                      <i className={`fa-brands fa-${key} text-lg`} />
                    </a>
                  ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/about"
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full border border-accent text-accent-dark font-semibold text-sm uppercase tracking-[0.15em] font-outfit transition-all duration-500 hover:bg-accent-dark hover:text-[#111] hover:border-accent-glow hover:shadow-[0_0_30px_rgba(212,245,60,0.08)]"
              >
                My Story
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
