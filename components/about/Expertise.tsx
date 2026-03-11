import { getSkills, getTechnologies } from "@/sanity/sanity.fetch";
import React from "react";
import Technology from "../shared/Technology";
import { StaggerContainer, StaggerItem } from "../motion/StaggerContainer";
import Highlight from "../shared/Highlight";

const Expertise = async () => {
  const technologies = await getTechnologies();
  const skills = await getSkills();
  return (
    <section className="mt-24 max-w-[731.250px] mx-auto lg:mx-0 lg:max-w-2xl">
      <h2 className="font-semibold text-4xl mb-4">
        <Highlight>Expertise</Highlight>
      </h2>
      <p className="text-sm sm:text-lg dark:text-gray text-gray-dark max-w-lg">
        I&apos;ve spent few years working on my soft skills, methodologies and
        tools. In no particular order, here are a few of them.
      </p>
      <div>
        <h3 className="capitalize font-semibold text-2xl mt-12 ">Skills</h3>
        <StaggerContainer className="flex flex-wrap items-center gap-3 mt-8" staggerDelay={0.05}>
          {skills?.map((skill) => (
            <StaggerItem key={skill._id}>
              <Technology
                title={skill.title}
                description={skill.description}
                slug={skill.slug}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
      <div>
        <h3 className="capitalize font-semibold text-2xl mt-12 ">
          Tools and Technologies
        </h3>
        <StaggerContainer className="flex flex-wrap items-center gap-3 mt-8" staggerDelay={0.05}>
          {technologies?.map((tech) => (
            <StaggerItem key={tech._id}>
              <Technology
                logo={tech.logo ?? ""}
                title={tech.title}
                description={tech.description}
                slug={tech.slug}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Expertise;
