"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ProfileType } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SectionAnimationContext {
  card: HTMLDivElement;
  glow: HTMLDivElement | null;
  overlay: HTMLDivElement | null;
  lightSweep: HTMLDivElement | null;
  wrapper: HTMLDivElement;
  addTrigger: (st: ScrollTrigger) => void;
  addTween: (tw: gsap.core.Tween) => void;
  addTimeline: (tl: gsap.core.Timeline) => void;
  activeSectionRef: React.MutableRefObject<string>;
}

interface FloatingImageLayoutProps {
  profile: ProfileType;
  children: React.ReactNode;
  className?: string;
  overlayContent?: React.ReactNode;
  setupSectionAnimations?: (ctx: SectionAnimationContext) => void;
  alwaysTilt?: boolean;
}

// ─── Tuning Constants ────────────────────────────────────────────────────────

const PARALLAX_DISTANCE = -60;
const MAX_TILT_DEG = 4;
const TILT_EASE_DURATION = 0.5;
const ENTRY_DURATION = 0.9;
const GLOW_BASE_OPACITY = 0.35;

// ─── Component ───────────────────────────────────────────────────────────────

export default function FloatingImageLayout({
  profile,
  children,
  className,
  overlayContent,
  setupSectionAnimations,
  alwaysTilt = false,
}: FloatingImageLayoutProps) {
  // ─── Refs: Layout ──────────────────────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // ─── Refs: Card layers ─────────────────────────────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);

  // ─── Refs: State tracking ──────────────────────────────────────────────────
  const activeSectionRef = useRef<string>("hero");

  // ─── Mouse tilt handler ────────────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      if (!alwaysTilt && activeSectionRef.current !== "hero") return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      gsap.to(card, {
        rotateY: deltaX * MAX_TILT_DEG,
        rotateX: -deltaY * MAX_TILT_DEG,
        duration: TILT_EASE_DURATION,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [alwaysTilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: TILT_EASE_DURATION,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  // ─── GSAP setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (cardRef.current) gsap.set(cardRef.current, { opacity: 1 });
      if (glowRef.current)
        gsap.set(glowRef.current, { opacity: GLOW_BASE_OPACITY });
      return;
    }

    const card = cardRef.current;
    const glow = glowRef.current;
    const overlay = overlayRef.current;
    const lightSweep = lightSweepRef.current;
    const cardContainer = cardContainerRef.current;
    const wrapper = wrapperRef.current;

    if (!card || !cardContainer || !wrapper) return;

    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];
    const timelines: gsap.core.Timeline[] = [];

    const addTrigger = (st: ScrollTrigger) => triggers.push(st);
    const addTween = (tw: gsap.core.Tween) => tweens.push(tw);
    const addTimeline = (tl: gsap.core.Timeline) => {
      timelines.push(tl);
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    };

    // ── PHASE 1: Entry animation ─────────────────────────────────────────
    gsap.set(card, {
      opacity: 0,
      rotateX: 8,
      rotateY: -5,
      scale: 0.92,
      filter: "blur(4px)",
    });
    if (glow) gsap.set(glow, { opacity: 0, scale: 0.85 });

    addTween(
      gsap.to(card, {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: ENTRY_DURATION,
        delay: 0.35,
        ease: "power3.out",
      })
    );

    if (glow) {
      addTween(
        gsap.to(glow, {
          opacity: GLOW_BASE_OPACITY,
          scale: 1,
          duration: 1,
          delay: 0.5,
          ease: "power2.out",
        })
      );
    }

    // ── PHASE 2: Parallax on outer container ─────────────────────────────
    addTween(
      gsap.to(cardContainer, {
        y: PARALLAX_DISTANCE,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      })
    );

    // ── PHASE 3: Mouse tilt ──────────────────────────────────────────────
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // ── PHASE 4: Page-specific section animations ────────────────────────
    setupSectionAnimations?.({
      card,
      glow,
      overlay,
      lightSweep,
      wrapper,
      addTrigger,
      addTween,
      addTimeline,
      activeSectionRef,
    });

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      triggers.forEach((st) => st.kill());
      tweens.forEach((tw) => tw.kill());
      timelines.forEach((tl) => tl.kill());
    };
  }, [handleMouseMove, handleMouseLeave, setupSectionAnimations]);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapperRef}
      className={
        className ??
        "lg:flex lg:gap-8 max-w-7xl mx-auto px-6 lg:px-16 lg:-pt-16"
      }
    >
      {/* Left column: content sections */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* Right column: cinematic sticky card (desktop only) */}
      <div className="hidden lg:block lg:w-[380px] lg:flex-shrink-0">
        <div
          ref={cardContainerRef}
          className="sticky top-[50vh] -translate-y-1/2"
          style={{ perspective: 1200 }}
        >
          {/* ── Base card structure ────────────────────────────────────── */}
          <div
            ref={cardRef}
            className="relative w-full"
            style={{ transformStyle: "preserve-3d", opacity: 0 }}
          >
            {/* ── Layer 0: Glow ──────────────────────────────────────── */}
            <div
              ref={glowRef}
              className="absolute -inset-4 rounded-3xl opacity-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(167,139,250,0.25) 0%, rgba(167,139,250,0.08) 50%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* ── Layer 1: Card shell ────────────────────────────────── */}
            <div className="relative rounded-2xl overflow-hidden bg-dark border border-white/[0.06] shadow-2xl shadow-black/40">
              {/* ── Layer 2: Portrait ──────────────────────────────── */}
              <div className="relative">
                <Image
                  src={profile.profileImage.image.url}
                  alt={profile.profileImage.alt}
                  width={400}
                  height={550}
                  priority
                  placeholder="blur"
                  blurDataURL={profile.profileImage.image.metadata.lqip}
                  className="w-full max-h-[550px] object-cover object-top"
                />
                {/* Gradient fade at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
              </div>

              {/* ── Layer 3: Overlay slot ──────────────────────────── */}
              <div
                ref={overlayRef}
                className="absolute inset-x-0 bottom-0 p-6 opacity-0 pointer-events-none"
                style={{ backdropFilter: "blur(12px)" }}
              >
                {overlayContent ?? (
                  <div className="bg-dark/50 rounded-xl p-5 border border-white/[0.06]">
                    <h3 className="font-outfit font-bold text-light text-lg mb-1">
                      {profile.fullName}
                    </h3>
                    <p className="text-sm text-white/60 mb-3 leading-relaxed line-clamp-2">
                      {profile.headline}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.location && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent/80 border border-accent/10">
                          {profile.location}
                        </span>
                      )}
                      <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent/80 border border-accent/10">
                        {profile.email}
                      </span>
                    </div>
                  </div>
                )}

                {/* Light sweep */}
                <div
                  ref={lightSweepRef}
                  className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
                    transform: "translateX(-100%)",
                  }}
                />
              </div>

              {/* ── Layer 4: Frame border ────────────────────────────── */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/[0.08] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
