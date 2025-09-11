import { Metadata } from "next";
import ContactForm from "@/components/shared/ContactForm";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons";
import siteMetadata from "@/utils/siteMetaData";
import Transition from "@/components/shared/Transition";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Get in touch with me for collaborations, projects, or just to say hello.",
};

export default function ContactPage() {
  const socialLinks = [
    {
      name: "GitHub",
      url: siteMetadata.github,
      icon: GithubIcon,
      description: "Check out my code",
    },
    {
      name: "LinkedIn",
      url: siteMetadata.linkedin,
      icon: LinkedinIcon,
      description: "Let's connect professionally",
    },
    {
      name: "Twitter",
      url: siteMetadata.twitter,
      icon: XIcon,
      description: "Follow me for updates",
    },
  ];

  return (
    <Transition>
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:px-20 py-16 min-h-screen">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark dark:text-light mb-6">
            Let&apos;s Work Together
          </h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl text-lg leading-relaxed">
            Have a project in mind or just want to say hello? I&apos;d love to hear from you.
            Drop me a message and I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="lg:order-2">
            <ContactForm />
          </div>

          {/* Contact Info & Socials */}
          <div className="lg:order-1 space-y-8 p-6 bg-white/30 dark:bg-gray-900/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                I&apos;m always interested in new opportunities and collaborations. 
                Whether you have a project in mind, want to discuss ideas, or just 
                want to connect, I&apos;d be happy to hear from you.
              </p>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a 
                  href={`mailto:${siteMetadata.email}`}
                  className="hover:text-accent dark:hover:text-accent transition-colors duration-300 font-medium"
                >
                  {siteMetadata.email}
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-dark dark:text-light mb-4">
                Connect with Me
              </h3>
              <div className="grid gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-500 hover:shadow-lg dark:hover:shadow-gray-900/30 hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-300 group backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/60"
                    >
                      <div className="flex-shrink-0">
                        <IconComponent className="w-6 h-6 fill-dark dark:fill-light group-hover:fill-accent dark:group-hover:fill-accent transition-colors duration-300" />
                      </div>
                      <div>
                        <h4 className="font-medium text-dark dark:text-light group-hover:text-accent transition-colors duration-300">
                          {social.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200 transition-colors duration-300">
                          {social.description}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-400 group-hover:text-accent transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-accent/10 to-accent-dark/10 dark:from-accent/15 dark:to-accent-dark/15 rounded-lg border border-accent/20 dark:border-accent/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">
                Quick Response
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                I typically respond to messages within 24 hours. For urgent matters, 
                feel free to reach out on LinkedIn for faster communication.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Transition>
  );
}