import { PortableText } from "@portabletext/react";
import GithubSlugger from "github-slugger";

const ProjectBlockText = ({
  title,
  content,
}: {
  title: string;
  content: any;
}) => {
  const slugger = new GithubSlugger();
  const slug = slugger.slug(title);
  return (
    <div className="flex flex-col mt-8 mb-4">
      <a href={`#${slug}`} aria-label="Link to Heading">
        <h3
          className="capitalize headlink font-semibold text-2xl mt-12"
          id={slug}
        >
          {title}
        </h3>
      </a>
      <div className="mt-8 prose leading-7 prose-sm  sm:prose-lg dark:text-gray text-gray-dark">
        <PortableText value={content} />
      </div>
    </div>
  );
};

export default ProjectBlockText;
