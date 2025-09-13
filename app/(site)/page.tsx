import { getEducations, getProfile, sanityFetch } from "@/sanity/sanity.fetch";
import HeroSvg from "../../components/icons/HeroSvg";
import AnimatedText from "@/components/shared/AnimatedText";
import Expertise from "@/components/about/Expertise";
import Experience from "@/components/about/Experience";
import Education from "@/components/about/Education";
import NewsletterSignup from "@/components/shared/NewsletterSignup";
import { WorkDetailsType } from "@/types";
import { worksGroq } from "@/sanity/sanity.queries";
import Transition from "@/components/shared/Transition";
import NewsletterBanner from "@/components/shared/NewsletterBanner";

export default async function Home() {
  const profile = await getProfile();
  const schools = await getEducations();
  const jobs: WorkDetailsType[] = await sanityFetch({
    query: worksGroq,
    tags: ["work"],
  });
  return (
    <Transition>
      <main className="px-6 mx-auto max-w-7xl lg:px-16 my-20 lg:my-28">
        <section className="flex flex-col items-start justify-between lg:flex-row lg:items-center lg:justify-center gap-x-12">
          {profile &&
            profile.map((data) => (
              <div
                key={data._id}
                className="max-w-2xl lg:max-w-max flex flex-col items-center self-center"
              >
                <AnimatedText
                  text={data.headline}
                  className="lg:!text-6xl !text-4xl md:!text-5xl !text-left"
                />
                <p className="text-base leading-relaxed text-gray-dark dark:text-gray">
                  {data.shortBio}
                </p>
                <ul className="flex self-start my-10 gap-x-6">
                  {Object.entries(data.socialLinks)
                    .sort()
                    .map(([key, value], id) => (
                      <li key={id}>
                        <a
                          href={value}
                          rel="noreferer noopener"
                          target="_blank"
                          aria-label="Connect with me"
                          className="flex items-center mb-5 duration-300 gap-x-2 hover:text-accent dark:hover:text-accent"
                        >
                        <i className={`fa-brands fa-${key} text-xl`} />
                          {key[0].toUpperCase() + key.toLowerCase().slice(1)}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          <HeroSvg />
        </section>
        <Experience jobs={jobs} />
        <Expertise />
        <Education schools={schools} />
        
        <section className="mt-20 lg:mt-28">
          <div className="text-center mb-4 md:mb-8">
            <AnimatedText
              text="Stay Connected"
              className="!text-4xl md:!text-5xl lg:!text-6xl mb-8"
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <NewsletterSignup 
              source="homepage"
              title="Join My Newsletter"
              description="Get updates on my latest projects, blog posts, and tech insights. No spam, just quality content!"
            />
            <NewsletterBanner />
            
          </div>
        </section>
      </main>
    </Transition>
  );
}
