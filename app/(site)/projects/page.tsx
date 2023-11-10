import { sanityFetch } from "@/sanity/sanity.client";
import { getProjects, projectsGroq } from "@/sanity/sanity.query";
import { ProjectType } from "@/types/projectType";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60 * 60 * 24;  // 24 hours

const Project = async () => {
  const projects = await getProjects();
  const project: ProjectType[] = await sanityFetch({
    query: projectsGroq,
    tags: ['project']
  })
  return (
    <main className="px-6 mx-auto max-w-7xl md:px-16">
      <section className="max-w-2xl mb-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight">
          Featured projects I&apos;ve built over the years
        </h1>
        <p className="text-base leading-relaxed text-zinc-400">
          I&apos;ve worked on tons of little projects over the years but these
          are the ones that I&apos;m most proud of. Many of them are
          open-source, so if you see something that piques your interest, check
          out the code and contribute if you have ideas for how it can be
          improved.
        </p>
      </section>
      <section className="grid grid-cols-1 gap-5 mb-12 xl:grid-cols-3 md:grid-cols-2">
        {project.map((project) => (
          <Link
          href={`/projects/${project.slug}`}
            key={project._id}
            className="flex items-center gap-x-4 bg-[#1d1d20] border border-transparent hover:border-zinc-700 p-4 rounded-lg ease-in-out"
          >
            <Image
              src={project.logo}
              width={60}
              height={60}
              alt={project.title}
              className="p-2 rounded-md bg-zinc-800"
            />
            <div>
              <h2 className="mb-1 font-semibold">{project.title}</h2>
              <div className="text-sm text-zinc-400">{project.tagline}</div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Project;
