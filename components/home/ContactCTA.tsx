"use client";

import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import NewsletterSignup from "@/components/shared/NewsletterSignup";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent-dark/5 to-transparent dark:from-accent/15 dark:via-accent-dark/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* CTA content */}
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark mb-6">
                    Let&apos;s Work{" "}
                    <span className="text-gradient-accent">Together</span>
                  </h2>
                  <p className="text-gray-dark dark:text-gray text-lg leading-relaxed mb-8">
                    Have a project in mind or just want to chat? I&apos;m always
                    open to discussing new opportunities and ideas.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl transition-all duration-300 font-semibold text-lg hover:shadow-accent-glow"
                  >
                    Get in Touch
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Newsletter */}
                <div>
                  <NewsletterSignup
                    source="homepage-cta"
                    title="Stay in the Loop"
                    description="Get updates on my latest projects, blog posts, and tech insights."
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
