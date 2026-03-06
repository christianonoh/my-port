"use client";

import Image from "next/image";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { TestimonialType } from "@/types";
import { Quote } from "lucide-react";

interface TestimonialsSectionProps {
  testimonials: TestimonialType[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-accent font-medium mb-3 font-outfit tracking-wide">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark">
              What People Say
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial._id}>
              <div className="p-6 rounded-xl border border-gray-light dark:border-gray-dark bg-light/50 dark:bg-dark/50 backdrop-blur-sm h-full flex flex-col">
                <Quote className="w-8 h-8 text-accent/30 mb-4" />
                <p className="text-gray-dark dark:text-gray leading-relaxed flex-1 mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {testimonial.avatar && (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold dark:text-light text-dark text-sm">
                      {testimonial.author}
                    </p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-xs text-gray-dark dark:text-gray">
                        {testimonial.role}
                        {testimonial.role && testimonial.company && " at "}
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
