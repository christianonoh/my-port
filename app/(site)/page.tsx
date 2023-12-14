import { getProfile } from "@/sanity/sanity.fetch";
import HeroSvg from "../../components/icons/HeroSvg";
import TransitionEffect from "@/components/TransitionEffect";
import AnimatedText from "@/components/AnimatedText";
import HireMe from "@/components/shared/HireMe";

export default async function Home() {
  const profile = await getProfile();
  return (
    <>
      <TransitionEffect />
      <main className="px-6 mx-auto max-w-7xl lg:px-16">
        <section className="flex flex-col items-start justify-between mt-12 mb-16 lg:flex-row lg:items-center lg:justify-center gap-x-12 lg:mt-32">
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
                <p className="text-base leading-relaxed text-zinc-400">
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
                          className="flex items-center mb-5 duration-300 gap-x-3 hover:text-purple-400"
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
