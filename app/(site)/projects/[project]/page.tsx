import AnimatedText from "@/components/shared/AnimatedText";
import ProjectBlockText from "@/components/project/ProjectBlockText";
import { getProject, getRelatedProjects, sanityFetch } from "@/sanity/sanity.fetch";
import Image from "next/image";
import Link from "next/link";
import siteMetadata from "@/utils/siteMetaData";
import { urlForImage } from "@/sanity/sanity.image";
import { notFound } from "next/navigation";
import { ProjectType } from "@/types";
import { groq } from "next-sanity";
import Transition from "@/components/shared/Transition";
import ScrollReveal from "@/components/motion/ScrollReveal";
import NewsletterBanner from "@/components/shared/NewsletterBanner";
import { ExternalLink, Github } from "lucide-react";

type Props = {
  params: Promise<{
    project: string;
  }>;
};

// Dynamic metadata for SEO
export async function generateMetadata({ params }: Props) {
  try {
    const { project: slug } = await params;
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

// Prepare Next.js to know which routes already exist
export async function generateStaticParams() {
  const query = groq`*[_type == "post" && defined(slug.current)][]{
   "slug": slug.current
  }`;
  const projects = await sanityFetch<ProjectType[] | []>({
    query: query,
    tags: ["project"],
  });

  return projects.map((project: any) => project);
}

const Project = async ({ params }: Props) => {
  const { project: slug } = await params;
  const [project, relatedProjects] = await Promise.all([
    getProject(slug),
    getRelatedProjects(slug),
  ]);

  if (!project) {
    notFound();
  }

  const sections = [
    { num: "01", title: "Overview", content: project.summary },
    { num: "02", title: "Problem Statement", content: project.problemStatement },
    { num: "03", title: "Features", content: project.features },
    { num: "04", title: "Milestones", content: project.milestone },
  ].filter((s) => s.content);

  return (
    <Transition>
      <main>
        {/* Hero banner */}
        <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
          {project.coverImage?.image && (
            <Image
              className="object-cover object-top w-full h-full"
              fill
              priority
              placeholder="blur"
              src={project.coverImage.image.url}
              alt={project.coverImage.alt || project.title}
              blurDataURL={project.coverImage.image?.metadata?.lqip}
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 max-w-7xl mx-auto">
            <p className="text-accent font-medium mb-2 font-outfit">{project.tagline}</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-outfit text-white mb-4">
              {project.title}
            </h1>
            <div className="flex gap-3">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors duration-300 font-medium text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300 font-medium text-sm backdrop-blur-sm"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto md:px-16 px-6 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main content */}
            <div className="lg:col-span-8">
              {sections.map((section, index) => (
                <ScrollReveal key={section.num} delay={index * 0.1}>
                  <ProjectBlockText
                    title={section.title}
                    content={section.content}
                    sectionNumber={section.num}
                  />
                </ScrollReveal>
              ))}
            </div>

            {/* Sidebar - Quick Facts */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Tech stack */}
                {project.stack && (
                  <ScrollReveal direction="right">
                    <div className="p-6 rounded-xl border border-gray-light dark:border-gray-dark bg-light/50 dark:bg-dark/50">
                      <h3 className="text-lg font-semibold font-rubik dark:text-light text-dark mb-4">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech: any) => (
                          <span
                            key={tech.key}
                            className="text-sm font-medium px-3 py-1.5 rounded-lg bg-accent/10 text-accent dark:text-accent-light"
                          >
                            {tech.key}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Links */}
                <ScrollReveal direction="right" delay={0.1}>
                  <div className="p-6 rounded-xl border border-gray-light dark:border-gray-dark bg-light/50 dark:bg-dark/50">
                    <h3 className="text-lg font-semibold font-rubik dark:text-light text-dark mb-4">
                      Links
                    </h3>
                    <div className="space-y-3">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Project
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors duration-200"
                        >
                          <Github className="w-4 h-4" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </aside>
          </div>

          {/* More Projects */}
          {relatedProjects && relatedProjects.length > 0 && (
            <ScrollReveal>
              <section className="mt-16 pt-12 border-t border-gray-light dark:border-gray-dark">
                <h2 className="text-2xl md:text-3xl font-bold font-outfit dark:text-light text-dark mb-8">
                  More Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProjects.slice(0, 3).map((related) => (
                    <Link
                      key={related._id}
                      href={`/projects/${related.slug}`}
                      className="group p-4 rounded-xl border border-gray-light dark:border-gray-dark hover:border-accent/50 dark:hover:border-accent/50 hover:shadow-accent-glow transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {related.logo && (
                          <Image
                            src={related.logo}
                            width={40}
                            height={40}
                            alt={related.title}
                            className="rounded-md"
                          />
                        )}
                        <h3 className="font-semibold dark:text-light text-dark group-hover:text-accent transition-colors duration-200">
                          {related.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-dark dark:text-gray line-clamp-2">
                        {related.tagline}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}
        </div>
      </main>
      <NewsletterBanner />
    </Transition>
  );
};

export default Project;
