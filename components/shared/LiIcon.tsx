"use client";

import { motion, useScroll } from "framer-motion";
import React from "react";
import Image from "next/image";

const LiIcon = ({ reference, logoUrl, companyName = "" }: any) => {
  const { scrollYProgress } = useScroll({
    target: reference,
    offset: ["center end", "center center"],
  });

  return (
    <figure className="absolute left-0 dark:stroke-light stroke-dark">
      <span
        rel="noreferrer noopener"
        className="sm:min-h-[60px] sm:min-w-[60px] min-h-[40px] min-w-[40px] rounded-md overflow-clip relative"
      >
        <svg
          className="-rotate-90 w-14 h-14 sm:w-auto sm:h-auto min-w-[40px]"
          width={75}
          height={75}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50%"
            cy="50%"
            r="40"
            className="stroke-accent stroke-1 fill-none"
          />
          <motion.circle
            style={{ pathLength: scrollYProgress }}
            cx="50%"
            cy="50%"
            r="40"
            className=" stroke-[5px] dark:fill-dark fill-light"
          />
          <circle
            cx="50%"
            cy="50%"
            r="33"
            className="animate-pulse stroke-1 fill-accent"
          />
        </svg>
        <Image
          src={logoUrl}
          width={60}
          height={60}
          className="object-cover object-center w-8/12 aspect-square absolute rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          alt={`${companyName} logo`}
          sizes="60px"
        />
      </span>
    </figure>
  );
};

export default LiIcon;
