import {
  getProfile,
  getEducations,
  sanityFetch,
} from "@/sanity/sanity.fetch";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { BiEnvelope, BiDownload, BiLinkExternal } from "react-icons/bi";
import Experience from "@/components/about/Experience";
import Expertise from "@/components/about/Expertise";
import Education from "@/components/about/Education";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { Metadata } from "next";
import { WorkDetailsType } from "@/types";
import { worksGroq } from "@/sanity/sanity.queries";
import Transition from "@/components/shared/Transition";
import AboutFloatingWrapper from "@/components/about/AboutFloatingWrapper";
import CallToAction from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "About",
};

const About = async () => {
  const profile = await getProfile();
  const schools = await getEducations();
  const jobs: WorkDetailsType[] = await sanityFetch({
    query: worksGroq,
    tags: ["work"],
  });

  return (
    <Transition>
      <main className="my-20 lg:my-28">
        {profile &&
          profile.map((data) => (
            <AboutFloatingWrapper key={data._id} profile={data}>
              {/* Mobile-only profile image */}
              <div className="lg:hidden mb-8">
                <Image
                  src={data.profileImage.image.url}
                  width={400}
                  height={600}
                  quality={100}
                  placeholder="blur"
                  sizes="@media (max-width: 470px) 100vw, 400px"
                  priority
                  blurDataURL={data.profileImage.image.metadata.lqip}
                  alt={data.profileImage.alt}
                  className="rounded-2xl object-cover object-top border-2 border-accent/10 max-h-96 min-h-96 bg-top mx-auto"
                />
              </div>

              {/* Bio */}
              <section>
                <ScrollReveal>
                  <div className="flex flex-col prose prose-sm sm:prose-lg gap-y-3 dark:text-gray text-gray-dark leading-relaxed">
                    <PortableText value={data.fullBio} />
                  </div>
                </ScrollReveal>
              </section>

              {/* Mobile-only resume links + email */}
              <div className="lg:hidden mt-8 mb-12 space-y-4">
                <div className="flex gap-4 w-full">
                  <a
                    aria-label="View Resume"
                    href={`${data.resumeURL}`}
                    target="_blank"
                    className="flex flex-1 items-center justify-center gap-x-2 dark:hover:border-accent/50 dark:bg-dark hover:border-accent/50 bg-light border border-transparent rounded-md duration-200 py-2 text-center cursor-pointer font-medium text-sm sm:text-lg shadow-sm dark:shadow-light/10"
                  >
                    View Resume <BiLinkExternal className="text-base" />
                  </a>
                  <a
                    aria-label="Download Resume"
                    href={`${data.resumeURL}?dl=${data.fullName.replace(
                      /\s+/g,
                      "_"
                    )}_resume`}
                    className="flex items-center justify-center dark:bg-dark border border-transparent dark:hover:border-accent/50 shadow-sm dark:shadow-light/10 hover:border-accent/50 bg-light rounded-md duration-200 py-2 px-4 hover:bg-accent hover:text-light cursor-pointer font-medium text-sm sm:text-lg"
                  >
                    <BiDownload className="text-base" />
                  </a>
                </div>
                <a
                  aria-label="Send Email"
                  href={`mailto:${data.email}`}
                  className="flex items-center justify-center gap-x-2 dark:hover:border-accent/50 dark:bg-dark hover:border-accent/50 bg-light border border-transparent rounded-md duration-200 py-2 text-center cursor-pointer font-medium text-sm sm:text-lg shadow-sm dark:shadow-light/10"
                >
                  <BiEnvelope className="text-lg" />
                  {data.email}
                </a>
              </div>

              {/* Experience */}
              <ScrollReveal>
                <Experience jobs={jobs} />
              </ScrollReveal>

              {/* Expertise */}
              <ScrollReveal>
                <Expertise />
              </ScrollReveal>

              {/* Education */}
              <div data-section="education">
                <ScrollReveal>
                  <Education schools={schools} />
                </ScrollReveal>
              </div>
            </AboutFloatingWrapper>
          ))}
      </main>
      <CallToAction />
    </Transition>
  );
};

export default About;
