"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import Image from "next/image";
import { urlForImage } from "@/sanity/sanity.image";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Extract text content from the code element
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

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-300" />
        )}
      </button>
      <pre className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto my-6 shadow-sm">
        {children}
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose prose-sm sm:prose-lg prose-slate dark:prose-invert max-w-none prose-table:m-0 prose-table:border-collapse prose-thead:bg-transparent prose-th:border-0 prose-td:border-0 prose-tr:border-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 mt-8 text-gray-900 dark:text-gray-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl font-medium mb-2 mt-4 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-4 italic my-4 text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),

          // Code blocks - handle the pre wrapper with copy button
          pre: ({ children }: any) => <CodeBlock>{children}</CodeBlock>,

          // Code - handle inline code and code block content
          code: ({ node, inline, className, children, ...props }: any) => {
            const isInlineCode = inline === true || !className;
  
  // Debug log
  console.log('Code component:', { 
    isInlineCode, 
    inline, 
    className, 
    children,
    childrenType: typeof children 
  });
  
  const cleanChildren = typeof children === 'string' 
    ? children.replace(/^`+|`+$/g, '') 
    : children;
  
  if (isInlineCode) {
    return (
      <code
        className="bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-[90%] font-mono text-slate-700 dark:text-slate-300 font-normal"
        {...props}
      >
        {cleanChildren}
      </code>
    );
  }

            // Code block content (triple backticks, wrapped by pre above)
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-accent hover:underline font-medium"
            >
              {children}
            </a>
          ),

          // Tables (GFM) - Completely override prose styles
          table: ({ children }) => (
            <div className="not-prose my-8 overflow-x-auto rounded-xl shadow-lg border border-gray-200/30 dark:border-gray-700/30">
              <table className="min-w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-slate-800 border-b-2">
              {children}
            </thead>
          ),
          tbody: ({ children }) => {
            const childrenArray = Array.isArray(children)
              ? children
              : [children];
            return (
              <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                {childrenArray.map((child: any, index: number) => {
                  if (
                    child?.type === "tr" ||
                    child?.props?.node?.tagName === "tr"
                  ) {
                    return (
                      <tr
                        key={index}
                        className={`
                          transition-all duration-200 ease-in-out
                          hover:bg-accent/10 hover:shadow-sm
                          ${
                            index % 2 === 0
                              ? "bg-white dark:bg-slate-900/50"
                              : "bg-gray-50 dark:bg-slate-800/50"
                          }
                        `}
                      >
                        {child.props?.children}
                      </tr>
                    );
                  }
                  return child;
                })}
              </tbody>
            );
          },
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100 border-r border-gray-200/20 dark:border-gray-700/20 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200/20 dark:border-gray-700/20 last:border-r-0">
              {children}
            </td>
          ),

          // Task lists (GFM)
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  disabled
                  className="mr-2 accent-accent"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },

          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-7">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,

          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />
          ),

          // Images
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return (
              <div className="my-6">
                <Image
                  src={src}
                  alt={alt || "Blog post image"}
                  width={800}
                  height={400}
                  className="rounded-lg shadow-md w-full h-auto"
                />
                {alt && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 italic mt-2">
                    {alt}
                  </p>
                )}
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
