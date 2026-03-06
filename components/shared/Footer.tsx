import siteMetadata from "@/utils/siteMetaData";
import { GithubIcon, LinkedinIcon, XIcon } from "../icons";
import Link from "next/link";

const Footer = () => {
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    { href: siteMetadata.twitter, icon: XIcon, label: "Twitter" },
    { href: siteMetadata.github, icon: GithubIcon, label: "Github" },
    { href: siteMetadata.linkedin, icon: LinkedinIcon, label: "Linkedin" },
  ];

  return (
    <footer className="border-t border-gray-light dark:border-gray-dark mt-auto">
      <div className="max-w-7xl mx-auto md:px-16 px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold font-outfit dark:text-light text-dark mb-4 text-lg">
              {siteMetadata.author}
            </h3>
            <div className="space-y-2 text-sm text-gray-dark dark:text-gray">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Available for work
              </p>
              <a
                href={`mailto:${siteMetadata.email}`}
                className="hover:text-accent transition-colors duration-200 block"
              >
                {siteMetadata.email}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold font-outfit dark:text-light text-dark mb-4 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-dark dark:text-gray hover:text-accent dark:hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-sm text-gray-dark dark:text-gray hover:text-accent dark:hover:text-accent transition-colors duration-200"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold font-outfit dark:text-light text-dark mb-4 text-lg">
              Connect
            </h3>
            <div className="flex gap-4 items-center">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect on ${social.label}`}
                    className="w-10 h-10 rounded-lg border border-gray-light dark:border-gray-dark flex items-center justify-center hover:border-accent dark:hover:border-accent hover:shadow-accent-glow transition-all duration-300"
                  >
                    <Icon className="h-4 w-auto fill-dark dark:fill-light hover:fill-accent dark:hover:fill-accent transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-light dark:border-gray-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <small className="text-gray-dark dark:text-gray font-mono">
            &copy; {new Date().getFullYear()} {siteMetadata.author}. All rights
            reserved.
          </small>
          <small className="text-gray-dark dark:text-gray hover:text-accent duration-200">
            <a
              href={siteMetadata.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              Built with Next.js &{" "}
              <span className="text-accent">Sanity</span>
            </a>
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
