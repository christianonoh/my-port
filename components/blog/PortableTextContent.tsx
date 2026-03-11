"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/sanity.image";
import { Copy, Check } from "lucide-react";
import { useState, useMemo } from "react";
import GithubSlugger from "github-slugger";
import {
  extractTocFromPortableText,
  getBlockText,
} from "@/lib/slugs";

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group my-6 md:my-8 -mx-6 sm:mx-0 sm:rounded-xl overflow-hidden border-y sm:border border-dark/[0.06] dark:border-light/[0.06]">
      <div className="flex items-center justify-between px-4 py-2 bg-dark/[0.03] dark:bg-light/[0.04] border-b border-dark/[0.06] dark:border-light/[0.06]">
        {language ? (
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray">
            {language}
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-medium text-gray hover:text-dark dark:hover:text-light transition-colors duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-[#0d1117] dark:bg-[#0a0e14] px-4 py-4 md:p-5 overflow-x-auto text-[13px] md:text-sm leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface PortableTextContentProps {
  content: any;
}

export default function PortableTextContent({
  content,
}: PortableTextContentProps) {
  /**
   * Pre-compute a map of heading block _key → slug.
   * This uses the exact same extraction logic as the TOC,
   * so the IDs are guaranteed to match.
   */
  const headingIdMap = useMemo(() => {
    const items = extractTocFromPortableText(content || []);
    const map = new Map<string, string>();

    // Walk through the content blocks to map _key → slug
    const slugger = new GithubSlugger();
    (content || []).forEach((block: any) => {
      if (
        block._type === "block" &&
        ["h1", "h2", "h3"].includes(block.style)
      ) {
        const text = getBlockText(block);
        const id = slugger.slug(text);
        map.set(block._key, id);
      }
    });

    return map;
  }, [content]);

  const components = useMemo(
    () => ({
      types: {
        image: ({ value }: any) => (
          <figure className="my-6 md:my-10 -mx-6 sm:mx-0">
            <div className="sm:rounded-xl overflow-hidden border-y sm:border border-dark/[0.04] dark:border-light/[0.04]">
              <Image
                src={urlForImage(value)?.url() || ""}
                alt={value.alt || "Blog image"}
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
            {value.alt && (
              <figcaption className="text-[13px] text-gray text-center mt-3 px-6 sm:px-0">
                {value.alt}
              </figcaption>
            )}
          </figure>
        ),
        code: ({ value }: any) => (
          <CodeBlock code={value.code} language={value.language} />
        ),
        table: ({ value }: any) => (
          <div className="my-6 md:my-10 -mx-6 sm:mx-0 overflow-x-auto sm:rounded-xl border-y sm:border border-dark/[0.06] dark:border-light/[0.06] max-w-full">
            <table className="min-w-full border-collapse">
              {value.rows && value.rows.length > 0 && (
                <>
                  <thead>
                    <tr className="bg-dark/[0.03] dark:bg-light/[0.04] border-b border-dark/[0.08] dark:border-light/[0.08]">
                      {value.rows[0].cells.map(
                        (cell: string, i: number) => (
                          <th
                            key={i}
                            className="px-3 md:px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-dark dark:text-light whitespace-nowrap"
                          >
                            {cell}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark/[0.04] dark:divide-light/[0.04]">
                    {value.rows
                      .slice(1)
                      .map((row: any, rowIndex: number) => (
                        <tr
                          key={rowIndex}
                          className="hover:bg-accent/[0.03] transition-colors duration-150"
                        >
                          {row.cells.map(
                            (cell: string, cellIndex: number) => (
                              <td
                                key={cellIndex}
                                className="px-3 md:px-5 py-3 text-sm text-gray leading-relaxed"
                              >
                                {cell}
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        ),
      },
      marks: {
        link: ({ children, value }: any) => (
          <a
            href={value.href}
            target={value.blank ? "_blank" : "_self"}
            rel={value.blank ? "noopener noreferrer" : ""}
            className="text-accent hover:text-accent-dark underline underline-offset-2 decoration-accent/30 hover:decoration-accent transition-colors duration-200 font-medium"
          >
            {children}
          </a>
        ),
        code: ({ children }: any) => (
          <code className="text-accent bg-accent/[0.06] px-1.5 py-0.5 rounded-md text-[0.9em] font-mono font-normal">
            {children}
          </code>
        ),
        strong: ({ children }: any) => (
          <strong className="font-semibold text-dark dark:text-light">
            {children}
          </strong>
        ),
      },
      block: {
        h1: ({ children, value }: any) => {
          const id = headingIdMap.get(value._key) || "";
          return (
            <h1
              id={id}
              className="group text-2xl md:text-4xl font-bold font-outfit text-dark dark:text-light mt-10 md:mt-16 mb-4 md:mb-6 leading-tight scroll-mt-24"
            >
              {children}
              <a
                href={`#${id}`}
                className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-accent no-underline hidden sm:inline"
                aria-label="Link to section"
              >
                #
              </a>
            </h1>
          );
        },
        h2: ({ children, value }: any) => {
          const id = headingIdMap.get(value._key) || "";
          return (
            <h2
              id={id}
              className="group text-xl md:text-3xl font-bold font-outfit text-dark dark:text-light mt-8 md:mt-14 mb-3 md:mb-5 leading-tight scroll-mt-24"
            >
              {children}
              <a
                href={`#${id}`}
                className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-accent no-underline hidden sm:inline"
                aria-label="Link to section"
              >
                #
              </a>
            </h2>
          );
        },
        h3: ({ children, value }: any) => {
          const id = headingIdMap.get(value._key) || "";
          return (
            <h3
              id={id}
              className="group text-lg md:text-2xl font-semibold font-outfit text-dark dark:text-light mt-6 md:mt-12 mb-3 md:mb-4 leading-snug scroll-mt-24"
            >
              {children}
              <a
                href={`#${id}`}
                className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-accent no-underline hidden sm:inline"
                aria-label="Link to section"
              >
                #
              </a>
            </h3>
          );
        },
        blockquote: ({ children }: any) => (
          <blockquote className="my-6 md:my-8 pl-4 md:pl-6 border-l-[3px] border-accent">
            <div className="text-base md:text-[17px] italic text-gray leading-[1.8] [&>p]:mb-2 [&>p:last-child]:mb-0">
              {children}
            </div>
          </blockquote>
        ),
        normal: ({ children }: any) => (
          <p className="mb-5 md:mb-6 text-gray-dark dark:text-gray leading-[1.75] md:leading-[1.85] text-[15px] md:text-[17px]">
            {children}
          </p>
        ),
      },
      list: {
        bullet: ({ children }: any) => (
          <ul className="mb-6 pl-6 space-y-2 text-gray-dark dark:text-gray leading-[1.8] text-base md:text-[17px] list-disc marker:text-accent/40">
            {children}
          </ul>
        ),
        number: ({ children }: any) => (
          <ol className="mb-6 pl-6 space-y-2 text-gray-dark dark:text-gray leading-[1.8] text-base md:text-[17px] list-decimal marker:text-accent marker:font-semibold">
            {children}
          </ol>
        ),
      },
    }),
    [headingIdMap]
  );

  return (
    <div className="max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
}