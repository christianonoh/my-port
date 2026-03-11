"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codeElement = (children as any)?.props?.children;
    const textToCopy =
      typeof codeElement === "string"
        ? codeElement
        : Array.isArray(codeElement)
          ? codeElement.join("")
          : codeElement?.props?.children || "";

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const className = (children as any)?.props?.className || "";
  const lang = className.replace("language-", "").split(" ")[0] || "";

  return (
    <div className="relative group my-6 md:my-8 -mx-6 sm:mx-0 sm:rounded-xl overflow-hidden border-y sm:border border-dark/[0.06] dark:border-light/[0.06]">
      <div className="flex items-center justify-between px-4 py-2 bg-dark/[0.03] dark:bg-light/[0.04] border-b border-dark/[0.06] dark:border-light/[0.06]">
        {lang ? (
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray">
            {lang}
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
        {children}
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          /* ── Headings — IDs injected by rehype-slug ────────── */
          h1: ({ id, children }) => (
            <h1
              id={id}
              className="group text-2xl md:text-4xl font-bold font-outfit text-dark dark:text-light mt-10 md:mt-16 mb-4 md:mb-6 leading-tight scroll-mt-24"
            >
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-accent no-underline hidden sm:inline"
                  aria-label="Link to section"
                >
                  #
                </a>
              )}
            </h1>
          ),
          h2: ({ id, children }) => (
            <h2
              id={id}
              className="group text-xl md:text-3xl font-bold font-outfit text-dark dark:text-light mt-8 md:mt-14 mb-3 md:mb-5 leading-tight scroll-mt-24"
            >
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-accent no-underline hidden sm:inline"
                  aria-label="Link to section"
                >
                  #
                </a>
              )}
            </h2>
          ),
          h3: ({ id, children }) => (
            <h3
              id={id}
              className="group text-lg md:text-2xl font-semibold font-outfit text-dark dark:text-light mt-6 md:mt-12 mb-3 md:mb-4 leading-snug scroll-mt-24"
            >
              {children}
              {id && (
                <a
                  href={`#${id}`}
                  className="ml-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-accent no-underline hidden sm:inline"
                  aria-label="Link to section"
                >
                  #
                </a>
              )}
            </h3>
          ),

          /* ── Paragraphs ──────────────────────────────────────── */
          p: ({ children }) => (
            <p className="mb-5 md:mb-6 text-gray-dark dark:text-gray leading-[1.75] md:leading-[1.85] text-[15px] md:text-[17px]">
              {children}
            </p>
          ),

          /* ── Blockquote ──────────────────────────────────────── */
          blockquote: ({ children }) => (
            <blockquote className="my-6 md:my-8 pl-4 md:pl-6 border-l-[3px] border-accent">
              <div className="text-base md:text-[17px] italic text-gray leading-[1.8] [&>p]:mb-2 [&>p:last-child]:mb-0">
                {children}
              </div>
            </blockquote>
          ),

          /* ── Code ────────────────────────────────────────────── */
          pre: ({ children }: any) => <CodeBlock>{children}</CodeBlock>,

          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline === true || !className) {
              return (
                <code
                  className="text-accent bg-accent/[0.06] px-1.5 py-0.5 rounded-md text-[0.9em] font-mono font-normal"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          /* ── Links ───────────────────────────────────────────── */
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-accent hover:text-accent-dark underline underline-offset-2 decoration-accent/30 hover:decoration-accent transition-colors duration-200 font-medium"
            >
              {children}
            </a>
          ),

          /* ── Lists ───────────────────────────────────────────── */
          ul: ({ children }) => (
            <ul className="mb-6 pl-6 space-y-2 text-gray-dark dark:text-gray leading-[1.8] text-base md:text-[17px] list-disc marker:text-accent/40">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 pl-6 space-y-2 text-gray-dark dark:text-gray leading-[1.8] text-base md:text-[17px] list-decimal marker:text-accent marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,

          /* ── Tables ──────────────────────────────────────────── */
          table: ({ children }) => (
            <div className="my-6 md:my-10 -mx-6 sm:mx-0 overflow-x-auto sm:rounded-xl border-y sm:border border-dark/[0.06] dark:border-light/[0.06] max-w-full">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-dark/[0.03] dark:bg-light/[0.04] border-b border-dark/[0.08] dark:border-light/[0.08]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-dark/[0.04] dark:divide-light/[0.04]">
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }: any) => (
            <tr
              className="hover:bg-accent/[0.03] transition-colors duration-150"
              {...props}
            >
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 md:px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-dark dark:text-light whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 md:px-5 py-3 text-sm text-gray leading-relaxed">
              {children}
            </td>
          ),

          /* ── Task lists ──────────────────────────────────────── */
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 accent-accent rounded"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },

          /* ── Horizontal rule ─────────────────────────────────── */
          hr: () => (
            <div className="my-12 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-dark/10 dark:bg-light/10" />
              <span className="w-1.5 h-1.5 rounded-full bg-dark/10 dark:bg-light/10" />
              <span className="w-1.5 h-1.5 rounded-full bg-dark/10 dark:bg-light/10" />
            </div>
          ),

          /* ── Images ──────────────────────────────────────────── */
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <figure className="my-6 md:my-10 -mx-6 sm:mx-0">
                <div className="sm:rounded-xl overflow-hidden border-y sm:border border-dark/[0.04] dark:border-light/[0.04]">
                  <Image
                    src={src}
                    alt={alt || "Blog post image"}
                    width={800}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                {alt && (
                  <figcaption className="text-[13px] text-gray text-center mt-3 px-6 sm:px-0">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}