"use client";

import { useCallback } from "react";
import { BiEnvelope, BiDownload, BiLinkExternal } from "react-icons/bi";
import gsap from "gsap";
import FloatingImageLayout, {
  type SectionAnimationContext,
} from "@/components/shared/FloatingImageLayout";
import { ProfileType } from "@/types";

interface AboutFloatingWrapperProps {
  profile: ProfileType;
  children: React.ReactNode;
}

const SCRUB_SMOOTHNESS = 0.6;

export default function AboutFloatingWrapper({
  profile,
  children,
}: AboutFloatingWrapperProps) {
  const aboutFloatingAnimations = useCallback(
    (ctx: SectionAnimationContext) => {
      const { card, glow, overlay, addTimeline } = ctx;

      // Show the overlay immediately on the about page
      if (overlay) {
        gsap.set(overlay, { opacity: 1 });
      }

      const educationEl = document.querySelector(
        '[data-section="education"]'
      );
      if (!educationEl) return;

      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: educationEl,
          start: "bottom 60%",
          end: "bottom 30%",
          scrub: SCRUB_SMOOTHNESS,
        },
      });
      exitTl
        .to(card, { opacity: 0, y: 20, scale: 0.97, duration: 1 }, 0)
        .to(glow, { opacity: 0, duration: 0.8 }, 0);
      addTimeline(exitTl);
    },
    []
  );

  const overlayContent = (
    <div className="bg-dark/50 rounded-xl p-5 border border-white/[0.06]">
      <div className="flex gap-3 w-full mb-3">
        <a
          aria-label="View Resume"
          href={`${profile.resumeURL}`}
          target="_blank"
          className="flex flex-1 items-center justify-center gap-x-2 hover:border-accent/50 bg-dark/70 border border-white/[0.08] rounded-md duration-200 py-2 text-center cursor-pointer font-medium text-xs text-light/80 hover:text-light pointer-events-auto"
        >
          View Resume <BiLinkExternal className="text-sm" />
        </a>
        <a
          aria-label="Download Resume"
          href={`${profile.resumeURL}?dl=${profile.fullName.replace(
            /\s+/g,
            "_"
          )}_resume`}
          className="flex items-center justify-center bg-dark/70 border border-white/[0.08] hover:border-accent/50 rounded-md duration-200 py-2 px-3 cursor-pointer font-medium text-xs text-light/80 hover:text-light pointer-events-auto"
        >
          <BiDownload className="text-sm" />
        </a>
      </div>
      <a
        aria-label="Send Email"
        href={`mailto:${profile.email}`}
        className="flex items-center justify-center gap-x-2 bg-dark/70 border border-white/[0.08] hover:border-accent/50 rounded-md duration-200 py-2 text-center cursor-pointer font-medium text-xs text-light/80 hover:text-light pointer-events-auto"
      >
        <BiEnvelope className="text-sm" />
        {profile.email}
      </a>
    </div>
  );

  return (
    <FloatingImageLayout
      profile={profile}
      alwaysTilt
      setupSectionAnimations={aboutFloatingAnimations}
      overlayContent={overlayContent}
      className="lg:flex lg:gap-8 max-w-7xl mx-auto px-6 md:px-12 lg:px-16"
    >
      {children}
    </FloatingImageLayout>
  );
}
