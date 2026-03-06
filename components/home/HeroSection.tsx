"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ProfileType } from "@/types";

interface HeroSectionProps {
  profile: ProfileType;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-dark/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-accent font-medium text-lg mb-4 font-outfit tracking-wide"
            >
              Hi, I&apos;m {profile.fullName.split(" ")[0]}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold font-outfit leading-tight mb-6"
            >
              <span className="dark:text-light text-dark">
                {profile.headline.split(" ").slice(0, -2).join(" ")}{" "}
              </span>
              <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
                {profile.headline.split(" ").slice(-2).join(" ")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-dark dark:text-gray leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {profile.shortBio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              {Object.entries(profile.socialLinks)
                .sort()
                .map(([key, value]) => (
                  <a
                    key={key}
                    href={value}
                    rel="noopener noreferrer"
                    target="_blank"
                    aria-label={`Connect on ${key}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-light dark:border-gray-dark hover:border-accent dark:hover:border-accent hover:shadow-accent-glow transition-all duration-300 text-sm font-medium"
                  >
                    <i className={`fa-brands fa-${key} text-accent`} />
                    {key[0].toUpperCase() + key.toLowerCase().slice(1)}
                  </a>
                ))}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-dark rounded-full blur-2xl opacity-20" />
              <Image
                src={profile.profileImage.image.url}
                alt={profile.profileImage.alt}
                width={400}
                height={400}
                priority
                placeholder="blur"
                blurDataURL={profile.profileImage.image.metadata.lqip}
                className="relative rounded-full object-cover object-top w-full h-full border-4 border-accent/20"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
