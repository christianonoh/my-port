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

export const revalidate = 60 * 60 * 24; // 24 hours

const Project = async ({ params }: Props) => {
  const slug = params.project;
  const project = await getProject(slug);
  return (
    <main className="max-w-6xl px-8 mx-auto lg:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <h1 className="mb-4 text-3xl font-bold lg:text-5xl lg:leading-tight">
            {project.title}
          </h1>

          <a
            href={project.projectUrl}
            rel="noreferrer noopener"
            className="bg-[#1d1d20] text-white hover:border-zinc-700 border border-transparent rounded-md px-4 py-2"
          >
            Explore
          </a>
        </div>
        <Image
          className="border rounded-xl border-zinc-800"
          width={900}
          height={460}
          src={project.coverImage?.image}
          alt={project.coverImage?.alt || project.title}
        />
        <div className="flex flex-col mt-8 leading-7 gap-y-6 text-zinc-400">
          <PortableText value={project.description} />
        </div>
      </div>

    </main>
  )
}

export default Project;