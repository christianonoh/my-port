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
    <div className="flex flex-col mt-8 mb-4">
      <a href={`#${slug}`} aria-label="Link to Heading">
        <h3
          className="capitalize headlink font-semibold text-2xl mt-12 flex items-baseline gap-3"
          id={slug}
        >
          {sectionNumber && (
            <span className="text-accent text-4xl font-outfit font-bold opacity-60">
              {sectionNumber}
            </span>
          )}
          {title}
        </h3>
      </a>
      <div className="mt-4 md:mt-6 prose leading-7 prose-sm sm:prose-lg dark:text-gray text-gray-dark">
        <PortableText value={content} />
      </div>
    </div>
  );
};

export default ProjectBlockText;
