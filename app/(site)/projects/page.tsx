import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import { getProjects } from "@/sanity/sanity.fetch";
import Image from "next/image";
import Link from "next/link";

const Project = async () => {
  const projects = await getProjects();

  return (
    <>
      <TransitionEffect />
      <main className="px-6 mx-auto max-w-7xl md:px-16">
        <section className="max-w-2xl mb-16  mt-12 lg:mt-32">
          <AnimatedText
            text="Featured projects I've built over the years"
            className="mb-8 lg:!text-6xl sm:!text-4xl md:!text-5xl  !text-3xl lg:leading-relaxed leading-relaxed text-center lg:text-left max-w-xl"
          />
          <p className="text-base leading-relaxed text-zinc-400">
            I&apos;ve worked on tons of little projects over the years but these
            are the ones that I&apos;m most proud of. Many of them are
            open-source, so if you see something that piques your interest,
            check out the code and contribute if you have ideas for how it can
            be improved.
          </p>
        </section>
        <section className="grid grid-cols-1 gap-5 mb-12 xl:grid-cols-3 md:grid-cols-2">
          {projects?.map((project) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project._id}
              className="flex flex-col gap-4 bg-dark border border-transparent hover:border-zinc-700 p-4 rounded-lg ease-in-out"
            >
              <span className="flex items-center gap-x-4">
                <Image
                  src={project.logo}
                  width={60}
                  height={60}
                  alt={project.title}
                  className="p-2 rounded-md bg-zinc-800"
                />
                <div>
                  <h2 className="mb-1 text-2xl font-semibold">
                    {project.title}
                  </h2>
                  <div className="text-sm text-zinc-400">{project.tagline}</div>
                </div>
              </span>
              {project?.stack && (
                <div className="flex gap-2 flex-wrap">
                  {project.stack.splice(0, 3).map((tech: any) => (
                    <div
                      key={tech.key}
                      className="text-xs uppercase text-accent whitespace-nowrap text-center bg-light/10 py-1 px-3 rounded"
                    >
                      {tech.key}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </section>
      </main>
    </>
  );
};

export default Project;
