import { getProfile } from "@/sanity/sanity.fetch";
import HeroSvg from "../../components/icons/HeroSvg";
import TransitionEffect from "@/components/shared/TransitionEffect";
import AnimatedText from "@/components/shared/AnimatedText";
import HireMe from "@/components/shared/HireMe";

export default async function Home() {
  const profile = await getProfile();
  return (
    <>
      <TransitionEffect />
      <main className="px-6 mx-auto max-w-7xl lg:px-16 my-20 lg:my-32">
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
                <ul className="flex items-center my-10 gap-x-6">
                  {Object.entries(data.socialLinks)
                    .sort()
                    .map(([key, value], id) => (
                      <li key={id}>
                        <a
                          href={value}
                          rel="noreferer noopener"
                          className="flex items-center mb-5 duration-300 gap-x-3 hover:text-accent dark:hover:text-accent"
                        >
                          {key[0].toUpperCase() + key.toLowerCase().slice(1)}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          <HeroSvg />
        </section>
      </main>
      <HireMe />
    </>
  );
}
