"use client";

import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/sanity.image";
import { ProjectType } from "@/types";

interface ProjectCardProps {
  project: ProjectType;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-xl overflow-hidden border border-gray-light dark:border-gray-dark hover:border-accent/30 dark:hover:border-accent/30 transition-colors duration-300 bg-light dark:bg-dark"
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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <h3 className="text-white font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{project.tagline}</p>
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
            {project.stack.slice(0, 4).map((tech: any) => (
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
  );
}
