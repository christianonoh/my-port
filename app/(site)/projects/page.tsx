import AnimatedText from "@/components/shared/AnimatedText";
import { sanityFetch } from "@/sanity/sanity.fetch";
import { Metadata } from "next";
import { projectsGroq } from "@/sanity/sanity.queries";
import { ProjectType } from "@/types";
import Transition from "@/components/shared/Transition";
import ProjectCard from "@/components/project/ProjectCard";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import NewsletterBanner from "@/components/shared/NewsletterBanner";

export const metadata: Metadata = {
  title: "Projects",
};

const Project = async () => {
  const projects = await sanityFetch<ProjectType[] | null>({
    query: projectsGroq,
    tags: ["project"],
  });

  return (
    <Transition>
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:px-20 py-16">
        <ScrollReveal>
          <section className="max-w-2xl mb-16">
            <AnimatedText
              text="Featured projects I've built over the years"
              className="mb-8 lg:!text-6xl sm:!text-4xl md:!text-5xl !text-3xl lg:leading-relaxed leading-relaxed lg:text-left max-w-xl"
            />
            <p className="text-base leading-relaxed dark:text-gray text-gray-dark">
              I&apos;ve worked on tons of little projects over the years but
              these are the ones that I&apos;m most proud of. Many of them are
              open-source, so if you see something that piques your interest,
              check out the code and contribute if you have ideas for how it can
              be improved.
            </p>
          </section>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-6 mb-12 xl:grid-cols-3 md:grid-cols-2">
          {projects?.map((project) => (
            <StaggerItem key={project._id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </main>
      <NewsletterBanner />
    </Transition>
  );
};

export default Project;
