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
      <main className="px-6 mx-auto max-w-7xl md:px-16 my-20 lg:my-32">
        <section className="max-w-2xl mb-16 ">
          <AnimatedText
            text="Featured projects I've built over the years"
            className="mb-8 lg:!text-6xl sm:!text-4xl md:!text-5xl  !text-3xl lg:leading-relaxed leading-relaxed lg:text-left max-w-xl"
          />
          <p className="text-base leading-relaxed dark:text-gray text-gray-dark">
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
              className="flex flex-col gap-2 sm:gap-4 dark:bg-dark bg-light border border-transparent dark:hover:border-gray-dark hover:border-gray-light shadow-sm p-4 rounded-lg ease-in-out"
            >
              <span className="flex items-center gap-x-2 sm:gap-x-4">
                <Image
                  src={project.logo}
                  width={60}
                  height={60}
                  alt={project.title}
                  className="p-2 rounded-md dark:bg-dark bg-light"
                />
                <div>
                  <h2 className="mb-1 sm:text-2xl text-base font-semibold">
                    {project.title}
                  </h2>
                  <div className="text-sm text-gray">{project.tagline}</div>
                </div>
              </span>
              {project?.stack && (
                <div className="flex gap-2 flex-wrap">
                  {project.stack.splice(0, 3).map((tech: any) => (
                    <div
                      key={tech.key}
                      className="sm:text-xs text-[8px] shadow-sm font-semibold uppercase dark:text-accent text-accent-dark whitespace-nowrap text-center dark:bg-gray-dark/20 bg-gray-light/10 sm:py-1 sm:px-3 py-[1px] px-1.5 rounded"
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
