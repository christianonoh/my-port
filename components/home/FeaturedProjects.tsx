"use client";

import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/sanity.image";
import { ProjectType } from "@/types";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { ArrowRight } from "lucide-react";

interface FeaturedProjectsProps {
  projects: ProjectType[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <p className="text-accent font-medium mb-3 font-outfit tracking-wide">
                Portfolio
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden sm:flex items-center gap-2 text-accent hover:text-accent-dark dark:hover:text-accent-light transition-colors duration-300 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <StaggerItem key={project._id}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block rounded-xl overflow-hidden border border-gray-light dark:border-gray-dark hover:border-accent/50 dark:hover:border-accent/50 hover:shadow-accent-glow transition-all duration-300 bg-light dark:bg-dark"
              >
                {/* Cover image */}
                <div className="relative aspect-video overflow-hidden bg-gray-light dark:bg-gray-dark">
                  {project.coverImage?.image ? (
                    <Image
                      src={urlForImage(project.coverImage.image)?.width(600).height(340).url() || ""}
                      alt={project.coverImage.alt || project.title}
                      width={600}
                      height={340}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : project.logo ? (
                    <div className="flex items-center justify-center h-full">
                      <Image
                        src={project.logo}
                        width={80}
                        height={80}
                        alt={project.title}
                        className="opacity-60"
                      />
                    </div>
                  ) : null}
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium text-sm">
                      View Project
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold dark:text-light text-dark mb-1 group-hover:text-accent transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-dark dark:text-gray line-clamp-2 mb-3">
                    {project.tagline}
                  </p>
                  {project.stack && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 3).map((tech: any) => (
                        <span
                          key={tech.key}
                          className="text-xs font-medium px-2 py-0.5 rounded bg-accent/10 text-accent dark:text-accent-light"
                        >
                          {tech.key}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors duration-300 font-medium"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
