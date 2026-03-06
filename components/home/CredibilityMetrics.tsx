"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface MetricProps {
  value: number;
  label: string;
  suffix?: string;
}

function AnimatedCounter({ value, label, suffix = "" }: MetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const steps = 40;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-outfit text-gradient-accent">
        {count}
        {suffix}
      </div>
      <p className="text-sm md:text-base text-gray-dark dark:text-gray mt-2 font-medium">
        {label}
      </p>
    </div>
  );
}

interface CredibilityMetricsProps {
  projectCount: number;
  blogCount: number;
  yearsExperience?: number;
}

export default function CredibilityMetrics({
  projectCount,
  blogCount,
  yearsExperience = 4,
}: CredibilityMetricsProps) {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12 px-8 rounded-2xl border border-gray-light dark:border-gray-dark bg-light/30 dark:bg-dark/30 backdrop-blur-sm">
          <AnimatedCounter value={yearsExperience} suffix="+" label="Years Experience" />
          <AnimatedCounter value={projectCount} suffix="+" label="Projects Built" />
          <AnimatedCounter value={blogCount} label="Blog Posts" />
          <AnimatedCounter value={100} suffix="%" label="Dedication" />
        </div>
      </div>
    </section>
  );
}
