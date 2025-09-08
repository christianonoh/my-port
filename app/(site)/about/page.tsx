import {
  getProfile,
  getEducations,
  sanityFetch,
} from "@/sanity/sanity.fetch";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { BiEnvelope, BiDownload, BiLinkExternal } from "react-icons/bi";
import AnimatedText from "@/components/shared/AnimatedText";
import Experience from "@/components/about/Experience";
import Expertise from "@/components/about/Expertise";
import Education from "@/components/about/Education";
import { Metadata } from "next";
import { WorkDetailsType } from "@/types";
import { worksGroq } from "@/sanity/sanity.queries";
import Transition from "@/components/shared/Transition";

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
      <main className="max-w-7xl w-full overflow-hidden mx-auto px-6 md:px-12 lg:px-16 my-20 lg:my-28">
        {profile &&
          profile.map((data) => (
            <div key={data._id}>
              <section className="grid lg:grid-cols-2 grid-cols-1 gap-x-6 justify-center justify-items-center ">
                <div className="order-2 col-span-1 lg:order-none">
                  {/* <AnimatedText
                    text={`Friends call me Burger 🍔 But I'm also ${data.fullName}`}
                    className="mb-8 lg:!text-6xl sm:!text-4xl md:!text-5xl  !text-3xl lg:leading-relaxed leading-relaxed text-center lg:text-left max-w-xl"
                  /> */}
                  <div className="flex flex-col prose prose-sm  sm:prose-lg gap-y-3 dark:text-gray text-gray-dark leading-relaxed">
                    <PortableText value={data.fullBio} />
                  </div>
                </div>
                <div className=" lg:order-1 col-span-1 order-none mb-12 flex flex-col justify-start items-center">
                  <div className="lg:sticky top-0 flex flex-col justify-self-center gap-y-8 transition-all ease-in-out duration-200">
                    <>
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
                        className="rounded-2xl mb-4 object-cover object-top border-2 border-light transform scale-x-[-1] max-h-96 min-h-96 bg-top"
                      />
                      <div className="flex gap-4 w-full">
                        <a
                          aria-label="View Resume"
                          href={`${data.resumeURL}`}
                          target="_blank"
                          className="flex flex-1 items-center justify-center gap-x-2 dark:hover:border-gray-dark dark:bg-dark  hover:border-gray-light bg-light border border-transparent
                       rounded-md duration-200 py-2 text-center cursor-pointer font-medium text-sm sm:text-lg shadow-sm dark:shadow-light/10"
                        >
                          View Resume <BiLinkExternal className="text-base" />
                        </a>
                        <a
                          aria-label="Download Resume"
                          href={`${data.resumeURL}?dl=${data.fullName.replace(
                            /\s+/g,
                            "_"
                          )}_resume`}
                          className="flex items-center justify-center dark:bg-dark border border-transparent
                        dark:hover:border-gray-dark  shadow-sm dark:shadow-light/10 hover:border-gray-light bg-light rounded-md duration-200 py-2 px-4 hover:bg-green-700 hover:text-light cursor-pointer font-medium text-sm sm:text-lg"
                        >
                          <BiDownload className="text-base" />
                        </a>
                      </div>
                    </>
                    <ul>
                      <li>
                        <a
                          aria-label="Send Email"
                          href={`mailto:${data.email}`}
                          className="flex flex-1 items-center justify-center gap-x-2 dark:hover:border-gray-dark dark:bg-dark  hover:border-gray-light bg-light border border-transparent
                       rounded-md duration-200 py-2 text-center cursor-pointer font-medium text-sm sm:text-lg shadow-sm dark:shadow-light/10"
                        >
                          <BiEnvelope className="text-lg" />
                          {data.email}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          ))}
        <Experience jobs={jobs} />
        <Expertise />
        <Education schools={schools} />
      </main>
    </Transition>
  );
};

export default About;
