"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/motion/ScrollReveal";

const services = [
  {
    title: "Web Applications",
    description:
      "Custom web apps built with React, Next.js, and Angular — from dashboards and platforms to crowdfunding sites. Fast, responsive, and designed to handle real users at scale.",
  },
  {
    title: "APIs & Backend Systems",
    description:
      "Reliable server-side architecture using PHP, Ruby on Rails, and Node.js. REST APIs, database design, and backend logic that your frontend can depend on.",
  },
  {
    title: "Product Features",
    description:
      "End-to-end feature delivery — from requirements to production. I've built booking flows, timed exam platforms, donation ledgers, and ERP modules that solve real business problems.",
  },
  {
    title: "Performance & Code Quality",
    description:
      "Auditing and improving existing codebases for speed, maintainability, and cross-device reliability. Clean architecture, testing practices, and documentation that teams can build on.",
  },
];

export default function ServicesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section data-section="services" className="py-20 lg:py-28">
      <ScrollReveal>
        {/* Eyebrow */}
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
          Services
        </span>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit uppercase text-dark dark:text-light mb-6 leading-[1.05]">
          What I Can Do
          <br />
          For You
        </h2>

        {/* Subtext */}
        <p className="text-gray leading-relaxed text-lg mb-12 max-w-lg">
          As a full-stack developer, I transform ideas into polished,
          high-performance web applications that drive results.
        </p>

        {/* Accordion */}
        <div className="border-t border-dark/[0.06] dark:border-light/[0.06]">
          {services.map((service, index) => {
            const isOpen = openIndex === index;
            const number = String(index + 1).padStart(2, "0");

            return (
              <div
                key={service.title}
                className="border-b border-dark/[0.06] dark:border-light/[0.06]"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center gap-4 sm:gap-6 py-5 sm:py-6 text-left group"
                >
                  {/* Number */}
                  <span
                    className={`text-sm font-medium tabular-nums transition-colors duration-300 shrink-0 ${
                      isOpen ? "text-accent" : "text-gray/50"
                    }`}
                  >
                    {number}
                  </span>

                  {/* Title */}
                  <span
                    className={`flex-1 text-lg sm:text-xl md:text-2xl font-bold font-outfit uppercase tracking-wide transition-colors duration-300 ${
                      isOpen
                        ? "text-dark dark:text-light"
                        : "text-dark/70 dark:text-light/70 group-hover:text-dark dark:group-hover:text-light"
                    }`}
                  >
                    {service.title}
                  </span>

                  {/* Toggle icon */}
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-accent text-white rotate-0"
                        : "bg-dark/[0.04] dark:bg-light/[0.06] text-gray group-hover:bg-accent/10 group-hover:text-accent"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    >
                      <path
                        d="M7 2v10M2 7h10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 sm:pl-14 pb-6 pr-12">
                        <p className="text-gray leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}