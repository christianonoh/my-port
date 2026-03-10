"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { glassClasses, glassShadow } from "@/utils";

const Technology = ({
  title,
  className,
  description,
  href = "#",
  enableHover = true,
  slug,
  logo,
}: {
  title: string;
  className?: string;
  href?: string;
  description: string;
  enableHover?: boolean;
  slug?: string;
  logo?: any;
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (enableHover) {
      setShowDescription(true);
    }
  };

  const handleMouseLeave = () => {
    if (enableHover) {
      setShowDescription(false);
    }
  };

  const getTooltipPosition = () => {
    if (!containerRef.current) return "";
    const rect = containerRef.current.getBoundingClientRect();
    // If less than 240px of space to the right, align tooltip to the right
    if (window.innerWidth - rect.left < 240) return "right-0";
    return "";
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${glassClasses} ${glassShadow} hover:border-dark/[0.15] dark:hover:border-light/[0.15] transition-all duration-300 ease-out flex items-center gap-2 rounded-md px-2 py-1 ${
        enableHover ? "cursor-pointer" : ""
      } ${showDescription ? "z-20" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {logo && (
        <Image
          src={logo.url}
          width={24}
          height={24}
          className="object-cover object-center w-5 h-5 sm:w-6 sm:h-6 rounded-md ring-1 ring-dark/[0.06] dark:ring-light/[0.06] bg-light/80 dark:bg-light/90 p-[2px]"
          alt={`${title} logo`}
          sizes="24px"
        />
      )}
      <span className="text-sm sm:text-base font-medium">{title}</span>
      <AnimatePresence>
        {enableHover && showDescription && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute bg-light dark:bg-dark backdrop-blur-none border border-dark/[0.08] dark:border-light/[0.08] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] text-dark dark:text-light text-xs sm:text-sm leading-relaxed p-3 w-56 z-50 top-full mt-2 rounded-xl ${getTooltipPosition()}`}
          >
            {description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Technology;
