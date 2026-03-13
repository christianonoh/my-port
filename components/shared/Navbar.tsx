"use client";

import Link from "next/link";
import logo from "/public/logo.svg";
import Image from "next/image";
import { useOptimisticTheme } from "../../hooks/useOptimisticTheme";
import { useState, useEffect, useRef, useCallback } from "react";
import { cx, glassClasses, glassShadow } from "@/utils";
import {
  ThemeButton,
  Hamburger,
  LinkedinIcon,
  XIcon,
  GithubIcon,
} from "../icons";
import siteMetadata from "@/utils/siteMetaData";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// ── Constants ────────────────────────────────────────────────────────
const SCROLL_THRESHOLD = 80;
const SCROLL_DELTA = 8;

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

const socialLinks = [
  { href: siteMetadata.twitter, icon: XIcon, label: "Twitter" },
  { href: siteMetadata.github, icon: GithubIcon, label: "Github" },
  { href: siteMetadata.linkedin, icon: LinkedinIcon, label: "Linkedin" },
];

const glassShadowHover =
  "hover:shadow-[0_4px_28px_-4px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_28px_-4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.12)]";

// ── Component ────────────────────────────────────────────────────────
const Navbar = () => {
  const { theme, toggleTheme, isPending } = useOptimisticTheme();
  const [toggled, setToggled] = useState(false);
  const pathname = usePathname();

  // Scroll direction (desktop only behavior)
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const [pastThreshold, setPastThreshold] = useState(false);
  const lastScrollY = useRef(0);
  const rafId = useRef(0);

  // GSAP refs — mobile dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const linkItemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const footerRowRef = useRef<HTMLDivElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const isActive = (href: string) => {
    if (href === "/blog") return pathname.startsWith("/blog");
    return pathname === href;
  };

  // ── Scroll detection (rAF-throttled) ───────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;

        setPastThreshold(y > SCROLL_THRESHOLD);
        if (delta > SCROLL_DELTA) setScrollDir("down");
        else if (delta < -SCROLL_DELTA) setScrollDir("up");

        lastScrollY.current = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Desktop visibility: nav hides on scroll down, CTA shows
  const showDesktopNav = scrollDir === "up" || !pastThreshold;
  const showDesktopCta = scrollDir === "down" && pastThreshold;

  // ── Build GSAP dropdown timeline ───────────────────────────────────
  useEffect(() => {
    if (!dropdownRef.current || !backdropRef.current) return;

    const tl = gsap.timeline({ paused: true });

    // Backdrop
    tl.fromTo(
      backdropRef.current,
      { opacity: 0, display: "none" },
      { opacity: 1, display: "block", duration: 0.35, ease: "power2.out" },
      0
    );

    // Dropdown: scale + opacity from pill origin
    tl.fromTo(
      dropdownRef.current,
      {
        opacity: 0,
        scale: 0.92,
        y: -8,
        display: "none",
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        display: "block",
        duration: 0.4,
        ease: "power3.out",
      },
      0.05
    );

    // Link stagger
    const linkEls = linkItemsRef.current.filter(Boolean);
    if (linkEls.length) {
      tl.fromTo(
        linkEls,
        { x: -12, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.35, ease: "power2.out" },
        0.15
      );
    }

    // Footer row
    if (footerRowRef.current) {
      tl.fromTo(
        footerRowRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        0.3
      );
    }

    menuTimelineRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  // ── Play / reverse ─────────────────────────────────────────────────
  useEffect(() => {
    const tl = menuTimelineRef.current;
    if (!tl) return;
    toggled ? tl.timeScale(1).play() : tl.timeScale(1.8).reverse();
  }, [toggled]);

  // ── Toggle ─────────────────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    setToggled((prev) => !prev);
  }, []);

  // ── Close on route change ──────────────────────────────────────────
  useEffect(() => {
    setToggled(false);
  }, [pathname]);

  // ── Escape key ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && toggled) handleToggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggled, handleToggle]);

  return (
    <>
      {/* ── Main Nav Pill ─────────────────────────────────────────── */}
      <header
        className={cx(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 font-outfit transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          // Mobile: stretch to fill with max-width. Desktop: auto width.
          "w-[calc(100%-2rem)] max-w-[300px] sm:w-auto sm:max-w-none",
          "sm:transition-all",
          showDesktopNav
            ? "sm:translate-y-0 sm:opacity-100"
            : "sm:-translate-y-[calc(100%+2rem)] sm:opacity-0 sm:pointer-events-none"
        )}
      >
        <div
          className={cx(
            "flex items-center justify-between sm:justify-start rounded-full",
            glassClasses,
            glassShadow,
            "h-11 sm:h-[52px] pl-0.5 pr-1 sm:pl-1 sm:pr-4"
          )}
        >
          {/* Avatar */}
          <Link href="/" aria-label="Home" className="shrink-0 self-stretch flex items-center">
            <Image
              src={logo}
              alt="logo"
              height={40}
              width={40}
              className="rounded-full h-10 w-10 sm:h-[46px] sm:w-[46px] object-cover border-2 border-dark/[0.06] dark:border-light/[0.06]"
            />
          </Link>

          {/* ── Desktop: links + divider + theme ──────────────────── */}
          <nav className="hidden sm:flex items-center gap-7 pl-6 pr-1">
            <ul className="flex items-center gap-x-7">
              {navLinks.map((link) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cx(
                      "text-[15px] font-medium tracking-wide inline-block transition-all duration-300 group text-dark dark:text-light",
                      isActive(link.href)
                        ? "opacity-100"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <span className="relative">
                      {link.label}
                      <span
                        className={cx(
                          "absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ease-in-out",
                          isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <span className="w-px h-5 bg-dark/10 dark:bg-light/10" />

            <ThemeButton
              mode={theme}
              setMode={toggleTheme}
              isPending={isPending}
            />
          </nav>

          {/* ── Mobile: centered "Available for work" ─────────────── */}
          <Link href="/contact" className="flex sm:hidden flex-1 items-center justify-center gap-1.5">
            <span className="text-base font-mediu tracking-wide text-dark dark:text-light whitespace-nowrap">
              Available for work
            </span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </Link>

          {/* ── Mobile: hamburger with accent bg ──────────────────── */}
          <button
            onClick={handleToggle}
            aria-label={toggled ? "Close menu" : "Open menu"}
            className="flex sm:hidden items-center justify-center h-9 w-9 shrink-0 rounded-full bg-accent text-dark transition-transform duration-200 hover:scale-105"
          >
            <Hamburger handleToggle={() => {}} toggled={toggled} />
          </button>
        </div>

        {/* ── Mobile Dropdown (opens from pill, same width) ─────────── */}
        <div
          ref={dropdownRef}
          className={cx(
            "absolute top-[calc(100%+8px)] left-0 right-0 rounded-2xl p-4 sm:hidden",
            glassClasses,
            glassShadow,
            "origin-top"
          )}
          style={{ display: "none", opacity: 0 }}
        >
          {/* Nav links — centered */}
          <ul className="flex flex-col gap-0.5">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                ref={(el) => { linkItemsRef.current[i] = el; }}
                style={{ opacity: 0 }}
              >
                <Link
                  href={link.href}
                  onClick={handleToggle}
                  className={cx(
                    "flex items-center justify-center py-3 rounded-xl text-[15px] font-semibold tracking-wide transition-all duration-200",
                    isActive(link.href)
                      ? "text-accent bg-accent/[0.08]"
                      : "text-dark dark:text-light hover:bg-dark/[0.04] dark:hover:bg-light/[0.04]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Contact — accent CTA button */}
            <li
              ref={(el) => { linkItemsRef.current[navLinks.length] = el; }}
              className="mt-2"
              style={{ opacity: 0 }}
            >
              <Link
                href="/contact"
                onClick={handleToggle}
                className="flex items-center justify-center py-3 rounded-full bg-accent text-light text-[15px] font-bold tracking-wide transition-all duration-200 hover:brightness-110"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <div className="h-px w-full bg-dark/[0.06] dark:bg-light/[0.06] my-3" />

          {/* Footer: socials + theme */}
          <div
            ref={footerRowRef}
            className="flex items-center justify-between"
            style={{ opacity: 0 }}
          >
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect on ${social.label}`}
                  >
                    <Icon className="h-[18px] w-auto fill-dark/50 dark:fill-light/50 hover:fill-accent-dark dark:hover:fill-accent transition-colors duration-200" />
                  </a>
                );
              })}
            </div>

            <ThemeButton
              mode={theme}
              setMode={toggleTheme}
              isPending={isPending}
            />
          </div>
        </div>
      </header>

      {/* Backdrop — mobile only, closes menu on tap */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-40 sm:hidden"
        style={{ display: "none", opacity: 0 }}
        onClick={handleToggle}
      />

      {/* ── "Available for work" CTA — desktop scroll-down only ──── */}
      <div
        className={cx(
          "fixed top-4 left-1/2 -translate-x-1/2 z-30 font-outfit transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hidden sm:block",
          showDesktopCta
            ? "sm:translate-y-0 sm:opacity-100 sm:scale-100"
            : "sm:-translate-y-6 sm:opacity-0 sm:scale-95 sm:pointer-events-none"
        )}
      >
        <Link
          href="/contact"
          className={cx(
            "group flex items-center rounded-full",
            glassClasses,
            glassShadow,
            glassShadowHover,
            "hover:scale-[1.03] transition-all duration-300 h-[52px] pl-1 pr-5"
          )}
        >
          <Image
            src={logo}
            alt="avatar"
            height={46}
            width={46}
            className="rounded-full h-[46px] w-[46px] object-cover border-2 border-dark/[0.06] dark:border-light/[0.06]"
          />

          <span className="text-sm font-medium tracking-wide text-dark dark:text-light whitespace-nowrap pl-3">
            Available for work
          </span>

          <span className="relative flex h-2.5 w-2.5 ml-2">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="relative inline-flex h-full w-full rounded-full bg-emerald-500" />
          </span>
        </Link>
      </div>
    </>
  );
};

export default Navbar;