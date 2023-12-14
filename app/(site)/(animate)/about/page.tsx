import { getProfile, getJobs, getTechnologies } from "@/sanity/sanity.fetch";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { BiEnvelope, BiDownload, BiLinkExternal } from "react-icons/bi";
import Job from "../../../../components/Job";
import TransitionEffect from "@/components/TransitionEffect";
import AnimatedText from "@/components/AnimatedText";
import Technology from "@/components/shared/Technology";

const About = async () => {
  const profile = await getProfile();
  const jobs = await getJobs();
  const technologies = await getTechnologies();
  return (
    <>
      <TransitionEffect />
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative">
        {profile &&
          profile.map((data) => (
            <div key={data._id}>
              <section className="grid lg:grid-cols-2 grid-cols-1 gap-x-6 justify-items-center mt-12 lg:mt-32">
                <div className="order-2 lg:order-none">
                  {/* <h1 className=" lg:leading-tight basis-1/2 font-bold mb-8"></h1> */}
                  <AnimatedText
                    text={`Friends call me Burger 🍔 But I'm also ${data.fullName}`}
                    className="mb-8 lg:!text-6xl sm:!text-4xl md:!text-5xl  !text-3xl lg:leading-relaxed leading-relaxed text-center lg:text-left max-w-xl"
                  />
                  <div className="flex flex-col prose prose-lg gap-y-3 text-zinc-400 leading-relaxed">
                    <PortableText value={data.fullBio} />
                  </div>
                </div>
                <div className=" lg:order-1 order-none mb-12">
                  <span className="lg:sticky top-24 flex flex-col justify-self-center gap-y-8 transition-all ease-in-out duration-200">
                    <>
                      <Image
                        src={data.profileImage.image.url}
                        width={400}
                        height={600}
                        quality={100}
                        alt={data.profileImage.alt}
                        className="rounded-2xl mb-4 object-cover object-top border-2 transform scale-x-[-1] max-h-96 min-h-96 bg-top bg-[#1d1d20]"
                      />
                      <div className="grid grid-cols-2 gap-x-4">
                        <a
                          href={`${data.resumeURL}`}
                          className="flex items-center justify-center gap-x-2 bg-[#1d1d20] border border-transparent
                        hover:border-zinc-700 rounded-md duration-200 py-2 text-center cursor-pointer font-medium"
                        >
                          View Resume <BiLinkExternal className="text-base" />
                        </a>
                        <a
                          href={`${data.resumeURL}?dl=${data.fullName.replace(
                            /\s+/g,
                            "_"
                          )}_resume`}
                          className="flex items-center justify-center gap-x-2 bg-[#1d1d20] border border-transparent
                        hover:border-zinc-700 rounded-md duration-200 py-2 text-center cursor-pointer font-medium"
                        >
                          Download Resume <BiDownload className="text-base" />
                        </a>
                      </div>
                    </>
                    <ul>
                      <li>
                        <a
                          href={`mailto:${data.email}`}
                          className="flex items-center gap-x-2 hover:text-purple-400 duration-300"
                        >
                          <BiEnvelope className="text-lg" />
                          {data.email}
                        </a>
                      </li>
                    </ul>
                  </span>
                </div>
              </section>
              <section className="mt-24 max-w-[731.250px] mx-auto lg:mx-0 lg:max-w-2xl">
                <h2 className="font-semibold text-4xl mb-4">Expertise</h2>
                <p className="text-zinc-400 max-w-lg">
                  I&apos;ve spent few years working on my skills. In no
                  particular order, here are a few of them.
                </p>
                <ul className="flex flex-wrap items-center gap-3 mt-8">
                  {technologies?.map((tech, id) => (
                    <li key={id}>
                      <Technology
                        title={tech.title}
                        description={tech.description}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ))}
        <section className="mt-32 max-w-[731.250px] mx-auto lg:mx-0">
          <div className="mb-16">
            <h2 className="font-semibold text-4xl mb-4">Work Experience</h2>
          </div>

          <div className="flex flex-col gap-y-12">
            {jobs && jobs.map((job) => <Job job={job} key={job._id} />)}
          </div>
        </section>
      </main>
    </>
  );
};

export default About;
