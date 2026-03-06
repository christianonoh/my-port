"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { FAQType } from "@/types";
import { ChevronDown } from "lucide-react";

interface FAQSectionProps {
  faqs: FAQType[];
}

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQType;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-light dark:border-gray-dark rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-light/30 dark:hover:bg-gray-dark/30 transition-colors duration-200"
      >
        <span className="text-accent font-outfit font-bold text-lg min-w-[2rem]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-semibold dark:text-light text-dark">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-accent" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pl-[3.5rem] text-gray-dark dark:text-gray leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-6 lg:px-16">
        <ScrollReveal>
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-accent font-medium mb-3 font-outfit tracking-wide">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-outfit dark:text-light text-dark">
              Common Questions
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq._id}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
