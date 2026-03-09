import { PortableText } from "@portabletext/react";
import GithubSlugger from "github-slugger";

const ProjectBlockText = ({
  title,
  content,
  sectionNumber,
}: {
  title: string;
  content: any;
  sectionNumber?: string;
}) => {
  const slugger = new GithubSlugger();
  const slug = slugger.slug(title);

  return (
    <div className="mb-12 last:mb-0">
      <a
        href={`#${slug}`}
        aria-label={`Link to ${title}`}
        className="group inline-flex items-baseline gap-4"
      >
        <h3
          className="font-bold font-outfit text-2xl md:text-3xl text-dark dark:text-light capitalize flex items-baseline gap-4 mt-12 first:mt-0"
          id={slug}
        >
          {sectionNumber && (
            <span className="text-sm font-semibold tabular-nums text-accent tracking-wider">
              {sectionNumber}
            </span>
          )}
          <span className="group-hover:text-accent transition-colors duration-300">
            {title}
          </span>
        </h3>
      </a>

      {/* Accent line under heading */}
      <div className="w-12 h-0.5 bg-accent/30 mt-4 mb-6 rounded-full" />

      <div className="prose prose-lg max-w-none dark:text-gray text-gray-dark leading-relaxed [&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&_li]:mb-1.5 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent-dark [&_strong]:text-dark dark:[&_strong]:text-light [&_code]:text-accent [&_code]:bg-accent/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm">
        <PortableText value={content} />
      </div>
    </div>
  );
};

export default ProjectBlockText;