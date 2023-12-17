"use client";

import React, { RefObject, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { WorkDetailsType } from "@/types";
import LiIcon from "../shared/LiIcon";
import { PortableText } from "@portabletext/react";
import { formatDate } from "@/utils";
import siteMetadata from "@/utils/siteMetaData";

const Details = ({
  position,
  companyName,
  companyUrl,
  description,
  location,
  startDate,
  endDate,
  companyLogo,
}: WorkDetailsType) => {
  const ref: RefObject<HTMLLIElement> = useRef(null);
  return (
    <li
      ref={ref}
      className="my-8 first:mt-0 last:mb-0 flex flex-col justify-between"
    >
      <LiIcon reference={ref} logoUrl={companyLogo} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="ml-12 sm:ml-20 lg:ml-24 inline-block"
      >
        <h3 className="capitalize font-bold text-lg sm:text-2xl whitespace-nowrap ">
          <a
            href={companyUrl ?? ""}
            target="_blank"
            className="text-accent capitalize"
          >
            {companyName}
          </a>
        </h3>
        <span className="capitalize font-bold inline-block w-full  text-sm sm:text-lg whitespace-nowrap">
          {position}
        </span>
        <span className="capitalize text-sm sm:text-base text-gray">
          <span>
            {formatDate(startDate, "MMMM, yyyy")} -{" "}
            {endDate ? formatDate(endDate, "MMMM, yyyy") : "Present"}
          </span>
          <span className="whitespace-nowrap">
            {location ? ` | ${location}` : ""}
          </span>
        </span>
        <div className="dark:text-gray-light text-gray-dark w-full prose prose-sm md:prose-lg mt-4">
          <PortableText value={description} />
        </div>
      </motion.div>
    </li>
  );
};

const Experience = ({ jobs }: { jobs: WorkDetailsType[] | null }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <section className="mt-32 max-w-[731.250px] mx-auto lg:mx-0">
      <div className="mb-16">
        <h2 className="font-semibold text-4xl mb-4">Work Experience</h2>
      </div>

      <div className="relative w-full" ref={ref}>
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-7 sm:left-9 top-0 w-1 h-full origin-top dark:bg-light bg-dark"
        />
        <ul className="flex w-full flex-col items-start justify-between ml-4">
          {jobs &&
            jobs.map((job) => (
              <Details
                key={job._id}
                _id={job._id}
                position={job.position ?? siteMetadata.position}
                companyName={job.companyName}
                companyUrl={job.companyUrl ?? siteMetadata.siteUrl}
                description={job.description ?? []}
                location={job.location ?? ""}
                startDate={job.startDate}
                endDate={job.endDate}
                companyLogo={job.companyLogo ?? undefined}
              />
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Experience;
