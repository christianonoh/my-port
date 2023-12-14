"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const Technology = ({
  title,
  className,
  description,
  href = "#",
  enableHover = true,
  slug,
}: {
  title: string;
  className?: string;
  href?: string;
  description: string;
  enableHover?: boolean;
  slug?: string;
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [techSlug, setTechSlug] = useState("");

  const handleMouseEnter = (slug: string) => {
    if (enableHover) {
      setShowDescription(true);
      setTechSlug(slug);
    }
  };

  const handleMouseLeave = () => {
    if (enableHover) {
      setShowDescription(false);
      setTechSlug("");
    }
  };

  return (
    <div
      key={title}
      className={`relative bg-[#1d1d20] border border-transparent technology hover:border-zinc-700 rounded-md px-2 py-1 ${slug}  ${
        enableHover ? " cursor-pointer" : ""
      }`}
      onMouseEnter={() => handleMouseEnter(slug ?? "")}
      onMouseLeave={handleMouseLeave}
    >
      {title}
      {enableHover && showDescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute bg-accent text-center text-xs text-white p-2 w-48 z-10 top-8 rounded-md mt-2 transition-all ease-in-out duration-1000 ${
            // Check if the hovered item exists and if there's more space on the right
            document.querySelector(`.${techSlug}`) &&
            window.innerWidth -
              (document.querySelector(`.${techSlug}`)!.getBoundingClientRect()
                .left +
                192) <
              50
              ? "right-0"
              : ""
          }`}
        >
          {description}
        </motion.div>
      )}
    </div>
  );
};

export default Technology;
