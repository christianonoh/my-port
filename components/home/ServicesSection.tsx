"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/motion/ScrollReveal";

const services = [
  {
    title: "Frontend Development",
    description:
      "Building responsive, performant web interfaces with React, Next.js, and modern CSS frameworks that deliver exceptional user experiences.",
  },
  {
    title: "Backend Development",
    description:
      "Designing scalable APIs and server architectures with Node.js, Ruby on Rails, and databases to power robust applications.",
  },
  {
    title: "Responsive Design",
    description:
      "Crafting mobile-first experiences that look and work beautifully across all devices and screens, ensuring accessibility for every user.",
  },
  {
    title: "Full-Stack Solutions",
    description:
      "End-to-end application development from concept to deployment, with a focus on performance, scalability, and great UX.",
  },
];

export default function ServicesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section data-section="services" className="py-20 lg:py-24">
      <div>
        <ScrollReveal>
          <div>
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit uppercase dark:text-light text-dark mb-6">
                What I Can Do For You
              </h2>
              <p className="text-gray-dark dark:text-gray leading-relaxed text-lg mb-10 max-w-lg">
                As a full-stack developer, I transform ideas into polished, high-performance web applications that drive results and deliver great user experiences.
              </p>

              {/* Accordion services */}
              <div className="divide-y divide-gray-light dark:divide-gray-dark border-t border-gray-light dark:border-gray-dark">
                {services.map((service, index) => (
                  <div key={service.title}>
                    <button
                      onClick={() => toggle(index)}
                      className="w-full flex items-center justify-between py-5 text-left group"
                    >
                      <span className="text-xl md:text-2xl font-bold font-outfit uppercase dark:text-light text-dark tracking-wide">
                        <span className="text-gray-dark dark:text-gray font-normal mr-2">
                          {index + 1}.
                        </span>
                        {service.title}
                      </span>
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-dark dark:text-gray flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-dark dark:text-gray flex-shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-dark dark:text-gray leading-relaxed pb-5 pr-8">
                            {service.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
