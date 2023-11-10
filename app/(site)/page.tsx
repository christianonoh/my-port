import { getProfile } from '@/sanity/sanity.query'
import HeroSvg from "./icons/HeroSvg"

export default async function Home() {

  const profile = await getProfile();
  return (
    <main className="px-6 mx-auto max-w-7xl lg:px-16">
      <section className="flex flex-col items-start justify-between mt-20 mb-16 xl:flex-row xl:items-center xl:justify-center gap-x-12 lg:mt-32">
        {profile &&
          profile.map((data) => (
            <div key={data._id} className="max-w-2xl lg:max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
                {data.headline}
              </h1>
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
  )
}
