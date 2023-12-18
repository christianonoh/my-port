import AnimatedText from "@/components/shared/AnimatedText";
import TransitionEffect from "@/components/shared/TransitionEffect";
import ProjectBlockText from "@/components/project/ProjectBlockText";
import { getProject } from "@/sanity/sanity.fetch";
import Image from "next/image";
import siteMetadata from "@/utils/siteMetaData";
import { urlForImage } from "@/sanity/sanity.image";

type Props = {
  params: {
    project: string;
  };
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props) {
  try {
    const slug = params.project;
    const project = await getProject(slug);

    if (!project) {
      return {
        title: "Not Found",
        description: "The page you requested does not exist.",
      };
    }

    const ogImages = [
      {
        url: urlForImage(project.coverImage?.image)?.width(1200).url(),
        width: 1200,
        height: 630,
      },
    ];

    return {
      title: `${project.title} | Project`,
      description: project.tagline,
      alternates: {
        canonical: `/projects/${project.slug}`,
      },
      openGraph: {
        images: ogImages,
        title: project.title,
        description: project.tagline,
        siteName: siteMetadata.title,
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.tagline,
        images: ogImages || siteMetadata.socialBanner,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      title: "Not Found",
      description: "The page you requested does not exist.",
    };
  }
}

const Project = async ({ params }: Props) => {
  const slug = params.project;
  const project = await getProject(slug);
  return (
    <>
      <TransitionEffect />
      <main className="max-w-6xl w-full px-8 mx-auto lg:px-16  my-20 lg:my-32">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <AnimatedText
              text={project.title}
              className=" lg:!text-6xl sm:!text-4xl md:!text-5xl  !text-3xl lg:leading-relaxed leading-relaxed text-left max-w-xl"
            />

            <span>
              <a
                href={project.projectUrl}
                rel="noreferrer noopener"
                className="dark:bg-dark dark:text-white dark:hover:border-gray-dark bg-light
                text-gray-dark
                hover:border-gray-light border border-transparent rounded-md px-4 py-2 shadow-sm"
              >
                Explore
              </a>
            </span>
          </div>
          <div className="relative w-full h-[280px] sm:h-[380px]  md:h-[450px]">
            <Image
              className="border rounded-xl border-zinc-800 object-cover object-top w-full h-full"
              fill
              placeholder="blur"
              priority
              src={project.coverImage?.image.url}
              alt={project.coverImage?.alt || project.title}
              blurDataURL={project.coverImage?.image?.metadata.lqip}
              sizes="@media (max-width: 840px) 100vw, 840px"
            />
          </div>

          {project.summary && (
            <ProjectBlockText title="Summary" content={project.summary} />
          )}
          {project.problemStatement && (
            <ProjectBlockText
              title="Problem Statement"
              content={project.problemStatement}
            />
          )}

          {project.stack && (
            <div className="flex flex-col mt-8 mb-4">
              <a href="#tech-stack">
                <h3
                  className="capitalize headlink font-semibold text-2xl mt-12 "
                  id="tech-stack"
                >
                  Tech Stack
                </h3>
              </a>
              <div className="flex flex-col mt-8 prose prose-sm sm:prose-lg leading-7 gap-y-6">
                <ul>
                  {project.stack.map((tech: any) => (
                    <li key={tech.key}>
                      <span className="font-semibold dark:text-accent text-accent-dark whitespace-nowrap ">
                        {tech.key}:
                      </span>
                      <span className=" dark:text-gray text-gray-dark">
                        {" "}
                        {tech.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {project.features && (
            <ProjectBlockText title="Features" content={project.features} />
          )}
          {project.milestone && (
            <ProjectBlockText title="Milestones" content={project.milestone} />
          )}
        </div>
      </main>
    </>
  );
};

export default Project;
