import siteMetadata from "@/utils/siteMetaData";
import { GithubIcon, LinkedinIcon, XIcon } from "../icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto flex lg:flex-row flex-col items-center lg:justify-between justify-center gap-y-4 md:px-16 px-6 py-16 text-gray">
        <small className=" duration-200 font-mono">
          All rights reserved &copy; {new Date().getFullYear()}
        </small>
        <span className="flex flex-col gap-4">
          <span className="flex gap-8 items-center   mt-12 mx-auto">
            <a
              href={siteMetadata.twitter}
              target="_blank"
              aria-label="Connect with me on Twitter"
            >
              <XIcon className="h-4 w-auto fill-dark dark:fill-light hover:fill-accent-dark dark:hover:fill-accent  transition-all duration-300 ease-in-out" />
            </a>
            <a
              href={siteMetadata.github}
              target="_blank"
              aria-label="Connect with me on Github"
            >
              <GithubIcon className="h-4 w-auto hover:fill-accent-dark  fill-dark dark:fill-light dark:hover:fill-accent  transition-all duration-300 ease-in-out" />
            </a>
            <a
              href={siteMetadata.linkedin}
              target="_blank"
              aria-label="Connect with me on Linkedin"
            >
              <LinkedinIcon className="h-4 w-auto hover:fill-accent-dark dark:hover:fill-accent  fill-dark dark:fill-light  transition-all duration-300 ease-in-out" />
            </a>
          </span>
          <small
            className="text-center underline"
            aria-label="Connect with me on Twitter"
          >
            <Link href="/sitemap.xml" aria-label="Visit My Sitemap">
              sitemap.xml
            </Link>
          </small>
        </span>

        <small className="hover:text-accent duration-200">
          <a
            href="https://github.com/christianonoh"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Connect with me on Github"
          >
            Developed by{" "}
            <span className="text-accent hover:text-accent-dark">
              Christian Onoh
            </span>
          </a>
        </small>
      </div>
    </footer>
  );
};

export default Footer;
