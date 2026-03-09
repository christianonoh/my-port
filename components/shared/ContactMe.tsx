"use client";

import { useEffect, useState } from "react";
import { CircularText } from "../icons";
import Link from "next/link";
import { cx } from "@/utils";

const ContactMe = () => {
  const [visible, setVisible] = useState(false);

  // Fade in after scrolling past half the viewport
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cx(
        "fixed right-4 bottom-4 sm:right-8 sm:bottom-8 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-75 pointer-events-none"
      )}
    >
      <div className="relative group flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36">
        {/* Rotating circular text */}
        <CircularText className="absolute inset-0 w-full h-full fill-dark/80 dark:fill-light/80 animate-spin-slow group-hover:animate-none group-hover:[animation:none]" />

        {/* Center button */}
        <Link
          href="/contact"
          className={cx(
            "relative z-10 flex items-center justify-center rounded-full font-bold text-[0.625rem] sm:text-xs uppercase tracking-wider text-center leading-tight",
            "w-16 h-16 sm:w-20 sm:h-20 px-1",
            // Colors
            "bg-dark text-light dark:bg-light dark:text-dark",
            "border-2 border-dark/10 dark:border-light/10",
            // Hover — invert
            "hover:bg-light hover:text-dark dark:hover:bg-dark dark:hover:text-light",
            "hover:border-accent dark:hover:border-accent",
            // Transition & scale
            "transition-all duration-300",
            "group-hover:scale-110",
            "group-hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_8px_30px_-6px_rgba(109,40,217,0.15)]"
          )}
        >
          Contact
          <br />
          Me
        </Link>
      </div>
    </div>
  );
};

export default ContactMe;