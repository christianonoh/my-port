"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GithubSlugger from "github-slugger";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: any;
  markdownContent?: string | null;
  defaultOpen?: boolean;
}

function extractFromPortableText(blocks: any[]): TocItem[] {
  const slugger = new GithubSlugger();
  return blocks
    .filter(
      (block: any) =>
        block._type === "block" && ["h1", "h2", "h3"].includes(block.style)
    )
    .map((block: any) => {
      const text =
        block.children?.map((child: any) => child.text).join("") || "";
      return {
        id: slugger.slug(text),
        text,
        level: parseInt(block.style.replace("h", ""), 10),
      };
    });
}

function extractFromMarkdown(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    items.push({
      id: slugger.slug(match[2].trim()),
      text: match[2].trim(),
      level: match[1].length,
    });
  }

  return items;
}

export default function TableOfContents({
  content,
  markdownContent,
  defaultOpen = true,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [items, setItems] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const extracted = markdownContent
      ? extractFromMarkdown(markdownContent)
      : content
        ? extractFromPortableText(content)
        : [];
    setItems(extracted);
  }, [content, markdownContent]);

  useEffect(() => {
    if (items.length === 0) return;

    const timeout = setTimeout(() => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) =>
                a.boundingClientRect.top - b.boundingClientRect.top
            );

          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          }
        },
        {
          rootMargin: "-80px 0px -60% 0px",
          threshold: 0,
        }
      );

      items.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observerRef.current?.observe(el);
      });
    }, 300);

    return () => {
      clearTimeout(timeout);
      observerRef.current?.disconnect();
    };
  }, [items]);

  const scrollToHeading = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });
        window.history.pushState(null, "", `#${id}`);
      }
    },
    []
  );

  if (items.length < 2) return null;

  const minLevel = Math.min(...items.map((i) => i.level));
  const activeIndex = items.findIndex((i) => i.id === activeId);
  const progress =
    items.length > 0 && activeIndex >= 0
      ? ((activeIndex + 1) / items.length) * 100
      : 0;

  return (
    <nav aria-label="Table of contents">
      {/* Header — clickable to toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full group"
      >
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-dark dark:text-light">
          On this page
        </h3>
        <div className="flex items-center gap-2">
          {/* Mini progress when collapsed */}
          {!isOpen && activeIndex >= 0 && (
            <span className="text-[11px] tabular-nums text-accent font-medium">
              {activeIndex + 1}/{items.length}
            </span>
          )}
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-gray group-hover:text-dark dark:group-hover:text-light transition-colors duration-200"
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </button>

      {/* Progress bar */}
      <div className="mt-3 mb-1 h-[2px] bg-dark/[0.04] dark:bg-light/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Collapsible list */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            className="space-y-0.5 overflow-hidden pt-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {items.map((item) => {
              const indent = item.level - minLevel;
              const isActive = activeId === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToHeading(e, item.id)}
                    className={`
                      block text-[13px] leading-snug py-1.5 transition-all duration-200
                      border-l-2
                      ${indent === 1 ? "pl-7" : indent === 2 ? "pl-11" : "pl-3"}
                      ${
                        isActive
                          ? "border-accent text-accent font-medium"
                          : "border-transparent text-gray hover:text-dark dark:hover:text-light hover:border-dark/20 dark:hover:border-light/20"
                      }
                    `}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}