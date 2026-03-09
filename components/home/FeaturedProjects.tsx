"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/sanity.image";
import { ProjectType } from "@/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PillButton from "../shared/PillButton";
import ScrollReveal from "../motion/ScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeaturedProjectsProps {
  projects: ProjectType[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<(HTMLDivElement | null)[]>([]);

  const displayProjects = projects?.slice(0, 6) ?? [];

  const setInnerRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      innerRef.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    if (!wrapperRef.current || displayProjects.length === 0) return;

    const inners = innerRef.current.filter(Boolean) as HTMLDivElement[];
    const totalCards = inners.length;

    const ctx = gsap.context(() => {
      inners.forEach((inner, i) => {
        if (i >= totalCards - 1) return;

        // The card wrapper (parent of inner) is the sticky element
        const stickyCard = inner.parentElement;
        if (!stickyCard) return;

        // As user scrolls past this sticky card, scale it down and dim it
        // The trigger is the sticky card itself — when it starts being overlapped
        gsap.fromTo(
          inner,
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.9,
            filter: "brightness(0.25)",
            ease: "none",
            scrollTrigger: {
              trigger: stickyCard,
              start: "bottom bottom",
              end: () => `+=${window.innerHeight * 0.6}`,
              scrub: 0.2,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [displayProjects.length]);

  if (!projects || projects.length === 0) return null;

  return (
    <section className="relative py-24 lg:py-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 mb-16 lg:mb-24">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase dark:text-light text-dark leading-[1.05] tracking-tight font-outfit">
                Featured Projects
              </h2>
            </div>
            {/* <Link
              href="/blog"
              className="group relative inline-flex items-center gap-1 sm:gap-3 px-4 sm:px-10 py-2 sm:py-4 rounded-full border border-accent text-accent-dark font-semibold text-sm uppercase tracking-[0.15em] font-outfit transition-all duration-500 hover:bg-accent-dark hover:text-[#111] hover:border-accent-glow hover:shadow-[0_0_30px_rgba(212,245,60,0.08)]"
            >
              All Posts
              <ArrowRight className="w-4 h-4" />
            </Link> */}

            <div className="hidden md:block">
              <PillButton href="/projects" arrow>
                All Projects
              </PillButton>
            </div>
          </div>
        </ScrollReveal>

        {/* Cards */}
        <div ref={wrapperRef} className="relative max-w-[1100px] mx-auto">
          {displayProjects.map((project, index) => {
            const isLast = index === displayProjects.length - 1;

            return (
              <div
                key={project._id}
                className="sticky top-20"
                style={{ zIndex: index + 1 }}
              >
                {/*
                Each sticky card needs bottom padding equal to card height
                so the next card has room to scroll up and cover it.
                The last card doesn't need this.
              */}
                <div className={isLast ? "pb-0" : "pb-8"}>
                  <div
                    ref={(el) => setInnerRef(el, index)}
                    className="will-change-transform origin-top"
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block relative"
                    >
                      <div className="relative aspect-[16/10] sm:aspect-[16/9.5] lg:aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_2px_20px_-8px_rgba(0,0,0,0.35)]">
                        {/* Image */}
                        {project.coverImage?.image ? (
                          <Image
                            src={
                              urlForImage(project.coverImage.image)
                                ?.width(1400)
                                .height(788)
                                .url() || ""
                            }
                            alt={project.coverImage.alt || project.title}
                            width={1400}
                            height={788}
                            className="w-full h-full object-cover object-top transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                            priority={index < 2}
                          />
                        ) : project.logo ? (
                          <div className="flex items-center justify-center h-full bg-[#111]">
                            <Image
                              src={project.logo}
                              width={120}
                              height={120}
                              alt={project.title}
                              className="opacity-40"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                        )}

                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                        {/* Hover shimmer */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06]" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center text-center">
                          {/* Category pill */}
                          {project.stack && project.stack[0] && (
                            <span
                              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-4 bg-accent-dark "
                              style={{
                                // color: "#111",
                                boxShadow: "none",
                              }}
                            >
                              {project.stack[0].key}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] font-bold uppercase text-white mb-3 leading-[1.08] tracking-tight font-outfit">
                            {project.title}
                          </h3>

                          {/* Tagline */}
                          {project.tagline && (
                            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
                              {project.tagline}
                            </p>
                          )}
                        </div>

                        {/* Hover arrow */}
                        <div className="absolute top-5 right-5 md:top-7 md:right-7 w-10 h-10 rounded-full bg-white/[0.06] backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0 border border-white/[0.08]">
                          <svg
                            className="w-4 h-4 text-white/80"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 17L17 7M17 7H7M17 7v10"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="max-w-7xl mx-auto px-6 lg:px-16 mt-20 flex justify-center">
          <PillButton href="/projects" arrow>
            All Projects
          </PillButton>
        </div>
      </div>
    </section>
  );
}
