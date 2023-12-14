"use client";

import Link from "next/link";
import { useState } from "react";

const Technology = ({
  title,
  className,
  description,
  href = "#",
  enableHover = true,
}: {
  title: string;
  className?: string;
  href?: string;
  description: string;
  enableHover?: boolean;
}) => {
  const [showDescription, setShowDescription] = useState(false);

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

  return (
    <Link
      key={title}
      href={href}
      className={`relative bg-[#1d1d20] border border-transparent hover:border-zinc-700 rounded-md px-2 py-1 ${
        enableHover ? "cursor-pointer" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {title}
      {enableHover && showDescription && (
        <div className="absolute bg-accent text-center text-xs text-white p-2 w-full min-w-[384px] z-10 top-8 right-1/2 translate-x-1/2 rounded-md mt-2 transition-all ease-in-out duration-300">
          {description}
        </div>
      )}
    </Link>
  );
};

export default Technology;
