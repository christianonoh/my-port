"use client";

import { Code2, Layout, Server, Smartphone } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import ScrollReveal from "@/components/motion/ScrollReveal";

const services = [
  {
    icon: Layout,
    title: "Frontend Development",
    description:
      "Building responsive, performant web interfaces with React, Next.js, and modern CSS frameworks.",
  },
  {
    icon: Server,
    title: "Backend Development",
    description:
      "Designing scalable APIs and server architectures with Node.js, Ruby on Rails, and databases.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Crafting mobile-first experiences that look and work beautifully across all devices and screens.",
  },
  {
    icon: Code2,
    title: "Full-Stack Solutions",
    description:
      "End-to-end application development from concept to deployment, with a focus on performance and UX.",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-accent font-medium mb-3 font-outfit tracking-wide">
              What I Do
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark">
              Services & Expertise
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.title}>
                <div className="group p-6 rounded-xl border border-gray-light dark:border-gray-dark hover:border-accent/50 dark:hover:border-accent/50 hover:shadow-accent-glow transition-all duration-300 h-full bg-light/50 dark:bg-dark/50 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold font-rubik dark:text-light text-dark mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-dark dark:text-gray leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
