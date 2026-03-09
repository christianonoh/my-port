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
import ProjectBlockText from "@/components/project/ProjectBlockText";
import PillButton from "@/components/shared/PillButton";

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
        {/* ── Hero: Title + Meta ───────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 pt-32 md:pt-40">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            {/* Left: Title block */}
            <div>
              {/* Eyebrow */}
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                Project
              </span>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-outfit text-dark dark:text-light mb-4 leading-[1.05]">
                {project.title}
              </h1>

              <p className="text-gray text-base md:text-lg max-w-xl leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-full transition-all duration-300 font-semibold text-sm tracking-wide hover:scale-[1.03]"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 3h7v7M13 3L3 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-dark/[0.06] dark:bg-light/[0.08] hover:bg-dark/[0.1] dark:hover:bg-light/[0.14] text-dark dark:text-light rounded-full transition-all duration-300 font-semibold text-sm tracking-wide hover:scale-[1.03]"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Screenshot Showcase ──────────────────────────────────── */}
        {project.coverImage?.image && (
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 mb-16 md:mb-20">
            <div className="relative rounded-2xl overflow-hidden border border-dark/[0.06] dark:border-light/[0.06] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.4)]">
              {/* Browser chrome — frames screenshots as a real app */}
              <div className="flex items-center gap-2 px-4 py-3 bg-light dark:bg-dark/80 border-b border-dark/[0.06] dark:border-light/[0.06]">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                {project.projectUrl && (
                  <span className="ml-3 text-xs text-gray truncate max-w-xs">
                    {project.projectUrl.replace(/^https?:\/\//, "")}
                  </span>
                )}
              </div>

              <Image
                className="w-full h-auto"
                width={1400}
                height={900}
                priority
                placeholder="blur"
                src={project.coverImage.image.url}
                alt={project.coverImage.alt || project.title}
                blurDataURL={project.coverImage.image?.metadata?.lqip}
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>
          </div>
        )}

        {/* ── Content Area ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-8">
              {sections.map((section, index) => (
                <ScrollReveal key={section.num} delay={index * 0.08}>
                  <ProjectBlockText
                    title={section.title}
                    content={section.content}
                    sectionNumber={section.num}
                  />
                </ScrollReveal>
              ))}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Tech stack */}
                {project.stack && (
                  <ScrollReveal direction="right">
                    <div className="p-6 rounded-2xl border border-dark/[0.06] dark:border-light/[0.06] bg-light/50 dark:bg-dark/50">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-dark dark:text-light mb-4">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech: any) => (
                          <span
                            key={tech.key}
                            className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent/[0.08] dark:bg-accent/[0.12] text-accent dark:text-accent-light border border-accent/[0.06] dark:border-accent/[0.1]"
                          >
                            {tech.key}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Links */}
                {(project.projectUrl || project.githubUrl) && (
                  <ScrollReveal direction="right" delay={0.1}>
                    <div className="p-6 rounded-2xl border border-dark/[0.06] dark:border-light/[0.06] bg-light/50 dark:bg-dark/50">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-dark dark:text-light mb-4">
                        Links
                      </h3>
                      <div className="space-y-3">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between py-2.5 px-3 -mx-3 rounded-xl text-sm text-gray hover:text-accent hover:bg-accent/[0.04] dark:hover:bg-accent/[0.06] transition-all duration-300"
                          >
                            <span className="flex items-center gap-2.5">
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path
                                  d="M6 3h7v7M13 3L3 13"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Live Project
                            </span>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                            >
                              <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between py-2.5 px-3 -mx-3 rounded-xl text-sm text-gray hover:text-accent hover:bg-accent/[0.04] dark:hover:bg-accent/[0.06] transition-all duration-300"
                          >
                            <span className="flex items-center gap-2.5">
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                              </svg>
                              Source Code
                            </span>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                            >
                              <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Back to projects */}
                <ScrollReveal direction="right" delay={0.2}>
                  <div className="pt-2">
                    <PillButton href="/projects" arrow size="sm">
                      All Projects
                    </PillButton>
                  </div>
                </ScrollReveal>
              </div>
            </aside>
          </div>

          {/* ── Related Projects ──────────────────────────────────── */}
          {relatedProjects && relatedProjects.length > 0 && (
            <ScrollReveal>
              <section className="mt-20 pt-16 border-t border-dark/[0.06] dark:border-light/[0.06]">
                <div className="flex items-end justify-between mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold font-outfit text-dark dark:text-light">
                    More Projects
                  </h2>
                  <div className="hidden md:block">
                    <PillButton href="/projects" arrow size="sm">
                      View All
                    </PillButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProjects.slice(0, 3).map((related) => (
                    <Link
                      key={related._id}
                      href={`/projects/${related.slug}`}
                      className="group relative p-5 rounded-2xl border border-dark/[0.06] dark:border-light/[0.06] hover:border-accent/30 dark:hover:border-accent/20 bg-light/50 dark:bg-dark/50 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]"
                    >
                      <div className="flex items-start gap-4 mb-3">
                        {related.logo && (
                          <Image
                            src={related.logo}
                            width={44}
                            height={44}
                            alt={related.title}
                            className="rounded-xl border border-dark/[0.06] dark:border-light/[0.06]"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold font-outfit text-dark dark:text-light group-hover:text-accent transition-colors duration-300 truncate">
                            {related.title}
                          </h3>
                          <p className="text-sm text-gray line-clamp-2 mt-1 leading-relaxed">
                            {related.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Arrow — bottom right */}
                      <div className="flex justify-end">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-dark/[0.04] dark:bg-light/[0.06] text-gray transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:translate-x-0.5">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M3 8h10M9 4l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 text-center md:hidden">
                  <PillButton href="/projects" arrow size="sm">
                    View All
                  </PillButton>
                </div>
              </section>
            </ScrollReveal>
          )}
        </div>
      </main>
    </Transition>
  );
};

export default Project;