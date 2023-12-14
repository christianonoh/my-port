import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import { getProject } from "@/sanity/sanity.fetch";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

type Props = {
  params: {
    project: string;
  };
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props) {
  const slug = params.project;
  const project = await getProject(slug);

  return {
    title: `${project.title} | Project`,
    description: project.tagline,
    openGraph: {
      images: project.coverImage?.image || "add-a-fallback-project-image-here",
      title: project.title,
      description: project.tagline,
    },
  };
}

const Project = async ({ params }: Props) => {
  const slug = params.project;
  const project = await getProject(slug);
  return (
    <>
      <TransitionEffect />
      <main className="max-w-6xl px-8 mx-auto lg:px-16  py-12 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="relative w-full h-[450px]">
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
          <div className="flex items-start justify-between my-4">
            <AnimatedText
              text={project.title}
              className="mb-8 lg:!text-6xl sm:!text-4xl md:!text-5xl  !text-3xl lg:leading-relaxed leading-relaxed text-center lg:text-left max-w-xl"
            />

            <a
              href={project.projectUrl}
              rel="noreferrer noopener"
              className="bg-[#1d1d20] text-white hover:border-zinc-700 border border-transparent rounded-md px-4 py-2"
            >
              Explore
            </a>
          </div>
          <div className="flex items-center mt-8 mb-4">
            <h2 className="text-xl font-semibold">About the project</h2>
            <div className="flex items-center ml-4 text-sm text-zinc-400">
              Technologies
            </div>
          </div>
          <div className="flex flex-col mt-8 leading-7 gap-y-6 text-zinc-400">
            <PortableText value={project.description} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Project;
