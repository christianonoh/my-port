import { getBlogPost, getBlogPosts } from "@/sanity/sanity.fetch";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Transition from "@/components/shared/Transition";
import ShareButtons from "@/components/blog/ShareButtons";
import TableOfContents from "@/components/blog/TableOfContents";
import NewsletterBanner from "@/components/shared/NewsletterBanner";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import PortableTextContent from "@/components/blog/PortableTextContent";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/sanity.image";
import siteMetadata from "@/utils/siteMetaData";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return (
    posts?.map((post) => ({
      slug: post.slug,
    })) || []
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const postUrl = `${siteMetadata.siteUrl}/blog/${slug}`;
  const imageUrl = post.coverImage?.image
    ? urlForImage(post.coverImage.image)?.width(1200).height(630).url() || ""
    : siteMetadata.socialBanner;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
      publishedTime: post.publishedAt,
      authors: [siteMetadata.author],
      tags: post.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
      creator: "@onohchristian",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const postUrl = `${siteMetadata.siteUrl}/blog/${slug}`;
  const imageUrl = post.coverImage?.image
    ? urlForImage(post.coverImage.image)?.width(1200).height(630).url() || ""
    : siteMetadata.socialBanner;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteMetadata.title,
      logo: {
        "@type": "ImageObject",
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: post.tags?.join(", ") || "",
    articleSection: post.category || "Technology",
    ...(post.readingTime && { timeRequired: `PT${post.readingTime}M` }),
  };

  return (
    <Transition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-20 md:pt-28">
        {/* ── Article Header ─────────────────────────────────────── */}
        <header className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 pb-4 md:pb-6">
          <nav className="mb-4 md:mb-6">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm text-gray hover:text-accent transition-colors duration-200"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              >
                <path
                  d="M10 12L6 8l4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Blog
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray">
            <time dateTime={post.publishedAt} className="font-medium">
              {publishedDate}
            </time>
            {post.readingTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray/40" />
                <span>{post.readingTime} min read</span>
              </>
            )}
            {post.category && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray/40" />
                <span className="text-accent font-medium">
                  {post.category}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-outfit text-dark dark:text-light leading-[1.1] mb-6 max-w-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-gray max-w-2xl leading-relaxed mb-4 md:mb-6">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-dark/[0.04] dark:bg-light/[0.06] text-gray"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* ── Cover Image ────────────────────────────────────────── */}
        {post.coverImage?.image && (
          <div className="max-w-7xl mx-auto px-0 sm:px-6 md:px-16 lg:px-20 mb-10 md:mb-20">
            <ScrollReveal>
              <div className="relative sm:rounded-2xl overflow-hidden shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.4)]">
                <Image
                  src={urlForImage(post.coverImage.image)?.url() || ""}
                  alt={post.coverImage.alt || post.title}
                  width={1400}
                  height={700}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ── Content + Sidebar ──────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-20 pb-16 md:pb-24">
          {/* Mobile TOC — visible only below lg */}
          <div className="lg:hidden mb-8">
            <div className="p-4 rounded-xl border border-dark/[0.06] dark:border-light/[0.06] bg-light/50 dark:bg-dark/50 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <TableOfContents
                content={
                  post.contentType !== "markdown" ? post.content : null
                }
                markdownContent={
                  post.contentType === "markdown"
                    ? post.markdownContent
                    : null
                }
                // defaultOpen={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* ── Main Article ──────────────────────────────────── */}
            <article className="lg:col-span-8 min-w-0">
              <div className="w-12 h-0.5 bg-accent/30 mb-10 rounded-full" />

              {post.contentType === "markdown" && post.markdownContent ? (
                <MarkdownRenderer content={post.markdownContent} />
              ) : (
                <PortableTextContent content={post.content} />
              )}

              {/* ── Post Footer ────────────────────────────────── */}
              <div className="mt-10 md:mt-16 pt-8 md:pt-10 border-t border-dark/[0.06] dark:border-light/[0.06]">
                <ScrollReveal>
                  <ShareButtons
                    title={post.title}
                    excerpt={post.excerpt}
                  />
                </ScrollReveal>

                <ScrollReveal delay={0.08}>
                  <div className="mt-8 md:mt-10 flex items-start gap-4 md:gap-5 p-4 md:p-6 rounded-xl md:rounded-2xl border border-dark/[0.06] dark:border-light/[0.06] bg-light/50 dark:bg-dark/50">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-accent font-bold font-outfit text-lg">
                        C
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold font-outfit text-dark dark:text-light mb-1">
                        Christian Onoh
                      </h3>
                      <p className="text-sm text-gray leading-relaxed mb-3">
                        Full-stack developer building modern web applications
                        and sharing knowledge with the developer community.
                      </p>
                      <div className="flex items-center gap-4">
                        <a
                          href="https://twitter.com/onohchristian"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray hover:text-accent transition-colors duration-200"
                        >
                          Twitter
                        </a>
                        <a
                          href="https://github.com/christianonoh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray hover:text-accent transition-colors duration-200"
                        >
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.16}>
                  <div className="mt-8 md:mt-10">
                    <Link
                      href="/blog"
                      className="group inline-flex items-center gap-2.5 text-sm font-semibold text-dark dark:text-light hover:text-accent transition-colors duration-200"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transition-transform duration-200 group-hover:-translate-x-1"
                      >
                        <path
                          d="M13 8H3M7 4L3 8l4 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      All Posts
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </article>

            {/* ── Sidebar ───────────────────────────────────────── */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="lg:sticky lg:top-12 space-y-8">
                <div className="p-6 rounded-2xl border border-dark/[0.06] dark:border-light/[0.06] bg-light/50 dark:bg-dark/50">
                  <TableOfContents
                    content={
                      post.contentType !== "markdown" ? post.content : null
                    }
                    markdownContent={
                      post.contentType === "markdown"
                        ? post.markdownContent
                        : null
                    }
                  />
                </div>

                <div className="p-6 rounded-2xl border border-dark/[0.06] dark:border-light/[0.06] bg-light/50 dark:bg-dark/50">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-dark dark:text-light mb-4">
                    Written by
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-accent font-bold font-outfit">
                        C
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark dark:text-light">
                        Christian Onoh
                      </p>
                      <p className="text-xs text-gray">
                        Full-stack Developer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href="https://twitter.com/onohchristian"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-gray hover:text-accent transition-colors duration-200"
                    >
                      Twitter
                    </a>
                    <span className="w-1 h-1 rounded-full bg-gray/30" />
                    <a
                      href="https://github.com/christianonoh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-gray hover:text-accent transition-colors duration-200"
                    >
                      GitHub
                    </a>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-dark/[0.06] dark:border-light/[0.06] bg-light/50 dark:bg-dark/50">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-dark dark:text-light mb-4">
                    More Articles
                  </h3>
                  <Link
                    href="/blog"
                    className="group flex items-center justify-between text-sm text-gray hover:text-accent transition-colors duration-200"
                  >
                    <span>View all blog posts</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <NewsletterBanner />
    </Transition>
  );
}