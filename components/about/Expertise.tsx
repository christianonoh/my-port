import { getSkills, getTechnologies } from "@/sanity/sanity.fetch";
import React from "react";
import Technology from "../shared/Technology";

const Expertise = async () => {
  const technologies = await getTechnologies();
  const skills = await getSkills();
  return (
    <section className="mt-24 max-w-[731.250px] mx-auto lg:mx-0 lg:max-w-2xl">
      <h2 className="font-semibold text-4xl mb-4">Expertise</h2>
      <p className="text-zinc-400 max-w-lg">
        I&apos;ve spent few years working on my soft skills, methodologies and
        tools. In no particular order, here are a few of them.
      </p>
      <div>
        <h3 className="capitalize font-semibold text-2xl mt-12 ">Skills</h3>
        <ul className="flex flex-wrap items-center gap-3 mt-8">
          {skills?.map((skill, id) => (
            <li key={id}>
              <Technology
                title={skill.title}
                description={skill.description}
                slug={skill.slug}
              />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="capitalize font-semibold text-2xl mt-12 ">
          Tools and Technologies
        </h3>
        <ul className="flex flex-wrap items-center gap-3 mt-8">
          {technologies?.map((tech, id) => (
            <li key={id}>
              <Technology
                logo={tech.logo ?? ""}
                title={tech.title}
                description={tech.description}
                slug={tech.slug}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Expertise;
