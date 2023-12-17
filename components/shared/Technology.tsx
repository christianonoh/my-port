"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

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
      className={`relative dark:bg-dark bg-light shadow-sm dark:shadow-light/10 border border-transparent technology flex items-center gap-2 dark:hover:border-gray-dark hover:border-gray-light rounded-md px-2 py-1 ${slug}  ${
        enableHover ? " cursor-pointer" : ""
      }`}
      onMouseEnter={() => handleMouseEnter(slug ?? "")}
      onMouseLeave={handleMouseLeave}
    >
      {logo && (
        <Image
          src={logo.url}
          width={24}
          height={24}
          className="object-cover rounded-[1px] object-center w-4 aspect-square bg-light p-[1px]"
          alt={`${title} logo`}
          sizes="24px"
        />
      )}
      <span className="text-xs sm:text-base">{title}</span>
      {enableHover && showDescription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute bg-accent-dark dark:bg-accent text-center text-xs text-light dark:text-dark p-2 w-48 z-10 top-8 rounded-md mt-2 transition-all ease-in-out duration-1000 ${
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
