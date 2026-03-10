import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SectionAnimationContext } from "@/components/shared/FloatingImageLayout";

const GLOW_BASE_OPACITY = 0.35;
const GLOW_PULSE_OPACITY = 0.5;
const SCRUB_SMOOTHNESS = 0.6;

export function homeFloatingAnimations(ctx: SectionAnimationContext) {
  const { card, glow, overlay, lightSweep, addTrigger, addTimeline, activeSectionRef } = ctx;

  // --- A. Services state: subtle depth shift + glow pulse ──────────────
  const servicesEl = document.querySelector('[data-section="services"]');
  if (servicesEl) {
    addTrigger(
      ScrollTrigger.create({
        trigger: servicesEl,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => (activeSectionRef.current = "services"),
        onLeaveBack: () => (activeSectionRef.current = "hero"),
        onLeave: () => (activeSectionRef.current = "hero"),
        onEnterBack: () => (activeSectionRef.current = "services"),
      })
    );

    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesEl,
        start: "top 60%",
        end: "bottom 40%",
        scrub: 0.8,
      },
    });
    servicesTl
      .to(
        card,
        {
          rotateY: 4,
          rotateX: -2,
          scale: 1.015,
          duration: 0.5,
          overwrite: false,
        },
        0
      )
      .to(glow, { opacity: GLOW_PULSE_OPACITY, duration: 0.5 }, 0)
      .to(
        card,
        { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5 },
        0.5
      )
      .to(glow, { opacity: GLOW_BASE_OPACITY, duration: 0.5 }, 0.5);
    addTimeline(servicesTl);
  }

  // --- B. About state: glass overlay with profile info ─────────────────
  const aboutEl = document.querySelector('[data-section="about"]');
  if (aboutEl && overlay) {
    addTrigger(
      ScrollTrigger.create({
        trigger: aboutEl,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => (activeSectionRef.current = "about"),
        onLeaveBack: () => (activeSectionRef.current = "hero"),
        onLeave: () => (activeSectionRef.current = "about"),
        onEnterBack: () => (activeSectionRef.current = "about"),
      })
    );

    // Fade in about overlay
    const aboutInTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutEl,
        start: "top 60%",
        end: "top 30%",
        scrub: SCRUB_SMOOTHNESS,
      },
    });
    aboutInTl.to(overlay, { opacity: 1, duration: 1 }, 0);
    addTimeline(aboutInTl);

    // Subtle light sweep
    if (lightSweep) {
      const sweepTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutEl,
          start: "top 50%",
          end: "top 15%",
          scrub: 0.8,
        },
      });
      sweepTl.fromTo(
        lightSweep,
        { x: "-100%" },
        { x: "200%", duration: 1 }
      );
      addTimeline(sweepTl);
    }

    // Fade out about overlay before exit
    const aboutOutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutEl,
        start: "bottom 70%",
        end: "bottom 50%",
        scrub: SCRUB_SMOOTHNESS,
      },
    });
    aboutOutTl.to(overlay, { opacity: 0, duration: 1 });
    addTimeline(aboutOutTl);
  }

  // --- C. Exit animation: card gracefully fades out at About bottom ────
  if (aboutEl) {
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutEl,
        start: "bottom 60%",
        end: "bottom 30%",
        scrub: SCRUB_SMOOTHNESS,
      },
    });
    exitTl
      .to(card, { opacity: 0, y: 20, scale: 0.97, duration: 1 }, 0)
      .to(glow, { opacity: 0, duration: 0.8 }, 0);
    addTimeline(exitTl);
  }
}
