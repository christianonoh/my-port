"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { EducationDetailsType, WorkDetailsType } from "@/types";
import LiIcon from "../shared/LiIcon";
import { PortableText } from "@portabletext/react";
import { formatDate } from "@/utils";
import siteMetadata from "@/utils/siteMetaData";

const Details = ({
  discipline,
  schoolName,
  schoolUrl,
  description,
  location,
  startDate,
  endDate,
  schoolLogo,
}: EducationDetailsType) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      className="my-8 first:mt-0 last:mb-0 flex flex-col justify-between"
    >
      <LiIcon reference={ref} logoUrl={schoolLogo} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="ml-12 sm:ml-20 lg:ml-24 inline-block"
      >
        <h3 className="capitalize font-bold text-lg sm:text-2xl whitespace-nowrap ">
          <a
            href={schoolUrl ?? ""}
            target="_blank"
            className="text-accent capitalize"
            aria-label="Visit School Website"
          >
            {schoolName}
          </a>
        </h3>
        <span className="capitalize font-bold inline-block w-full  text-sm sm:text-lg">
          {discipline}
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

const Education = ({ schools }: { schools: EducationDetailsType[] | null }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <section className="mt-32 max-w-[731.250px] mx-auto lg:mx-0">
      <div className="mb-16">
        <h2 className="font-semibold text-4xl mb-4">Education</h2>
      </div>

      <div className="relative w-full" ref={ref}>
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-7 sm:left-9 top-0 w-1 h-full origin-top dark:bg-light bg-dark"
        />
        <ul className="flex w-full flex-col items-start justify-between ml-4">
          {schools &&
            schools.map((school) => (
              <Details
                key={school._id}
                _id={school._id}
                discipline={school.discipline ?? siteMetadata.position}
                schoolName={school.schoolName}
                schoolUrl={school.schoolUrl ?? siteMetadata.siteUrl}
                description={school.description ?? []}
                location={school.location ?? ""}
                startDate={school.startDate}
                endDate={school.endDate}
                schoolLogo={school.schoolLogo ?? undefined}
              />
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Education;
