"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          btnRef.current,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
          "-=0.4"
        )
        .fromTo(
          orbitRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        );

      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 sm:py-36 font-outfit"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-accent/[0.06] dark:bg-accent/[0.08] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/[0.08] dark:bg-accent/[0.12] mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-accent dark:text-accent-light">
            Currently available
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-dark dark:text-light leading-[1.1]"
        >
          Let&apos;s build something{" "}
          <span className="relative inline-block">
            <span className="relative z-10">great</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 sm:h-4 bg-accent/15 dark:bg-accent/20 -rotate-1 rounded-sm" />
          </span>{" "}
          together
        </h2>

        {/* Subtext */}
        <p
          ref={subRef}
          className="mt-6 text-base sm:text-lg text-gray dark:text-gray-light max-w-md mx-auto leading-relaxed"
        >
          Got a project in mind or just want to chat? I&apos;m always open to
          new opportunities and ideas.
        </p>

        {/* CTA Button */}
        <div className="mt-10 relative inline-block">
          {/* Orbiting ring */}
          <div
            ref={orbitRef}
            className="absolute -inset-4 sm:-inset-5 rounded-full border border-dashed border-accent/15 dark:border-accent/20 pointer-events-none"
          />

          <Link
            href="/contact"
            ref={btnRef as React.Ref<HTMLAnchorElement>}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-dark dark:bg-light text-light dark:text-dark font-bold text-sm sm:text-base tracking-wide uppercase overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_8px_40px_-8px] dark:hover:shadow-accent-glow"
          >
            {/* Shine sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-light/15 dark:via-dark/10 to-transparent pointer-events-none" />

            <span className="relative z-10">Get in touch</span>

            {/* Arrow circle */}
            <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white transition-transform duration-300 group-hover:translate-x-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;