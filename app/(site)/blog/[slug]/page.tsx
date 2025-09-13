import { getBlogPost, getBlogPosts } from "@/sanity/sanity.fetch";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Transition from "@/components/shared/Transition";
import ShareButtons from "@/components/blog/ShareButtons";
import NewsletterBanner from "@/components/shared/NewsletterBanner";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/sanity.image";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  
  return posts?.map((post) => ({
    slug: post.slug,
  })) || [];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage?.image ? [urlForImage(post.coverImage.image)?.width(1200).height(630).url() || ""] : [],
    },
  };
}

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={urlForImage(value)?.url() || ""}
          alt={value.alt || "Blog image"}
          width={800}
          height={400}
          className="rounded-lg w-full h-auto"
        />
        {value.alt && (
          <p className="text-sm text-gray-500 text-center mt-2 italic">
            {value.alt}
          </p>
        )}
      </div>
    ),
    code: ({ value }: any) => (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6">
        <code className={`language-${value.language || 'javascript'}`}>
          {value.code}
        </code>
      </pre>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target={value.blank ? "_blank" : "_self"}
        rel={value.blank ? "noopener noreferrer" : ""}
        className="text-accent hover:text-accent-dark underline"
      >
        {children}
      </a>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
        {children}
      </code>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold text-dark dark:text-light mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold text-dark dark:text-light mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold text-dark dark:text-light mt-8 mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent pl-6 my-6 text-lg italic text-gray-600 dark:text-gray-300">
        {children}
      </blockquote>
    ),
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Transition>
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:px-20 py-8 md:py-16">
        {/* Mobile-optimized navigation */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-accent hover:text-accent-dark font-medium text-sm md:text-base transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <header className="mb-8 md:mb-12">
              {/* Mobile-optimized cover image */}
              {post.coverImage?.image && (
                <div className="mb-6 md:mb-8 -mx-6 md:mx-0">
                  <Image
                    src={urlForImage(post.coverImage.image)?.url() || ""}
                    alt={post.coverImage.alt || post.title}
                    width={800}
                    height={400}
                    className="w-full h-48 md:h-64 lg:h-80 object-cover md:rounded-lg shadow-lg"
                    priority
                  />
                </div>
              )}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-dark dark:text-light mb-4 md:mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* {post.excerpt && (
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )} */}

              <hr className="border-t border-gray-200 dark:border-gray-700 mt-6 md:mt-8 mb-3" />

              {/* Post meta */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-500 dark:text-gray-400 ">
                <i className="fa fa-calendar-alt mr-1"></i>
                <time dateTime={post.publishedAt} className="font-medium">
                  {publishedDate}
                </time>
                {post.readingTime && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <i className="fa fa-clock mr-1 text-small"></i>
                    <span>{post.readingTime} min read</span>
                  </>
                )}
                {post.category && (
                  <>
                    <span className="hidden md:inline">•</span>
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs md:text-sm">
                      {post.category}
                    </span>
                  </>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <hr className="border-t border-gray-200 dark:border-gray-700 " />
            </header>

            {/* Content with better mobile typography */}
            <div className="prose prose-sm md:prose-lg dark:prose-invert max-w-none 
                           prose-headings:text-dark dark:prose-headings:text-light
                           prose-p:text-gray-700 dark:prose-p:text-gray-300
                           prose-p:leading-relaxed prose-li:text-gray-700 dark:prose-li:text-gray-300
                           prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                           prose-code:text-accent prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                           prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                           prose-blockquote:border-accent prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400">
              <PortableText value={post.content} components={components} />
            </div>

            <hr className="border-t border-gray-200 dark:border-gray-700 my-6 md:my-8 block" />

            {/* Share buttons */}
            <div className="mt-8 md:mt-12">
              <ShareButtons 
                title={post.title} 
                excerpt={post.excerpt}
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
            <div className="space-y-6">
              {/* Author info card */}
              <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-3">
                  About the Author
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Christian Onoh is a full-stack developer passionate about building 
                  modern web applications and sharing knowledge with the developer community.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="https://twitter.com/onohchristian" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-dark text-sm transition-colors duration-200"
                  >
                    Follow on Twitter
                  </a>
                  <span className="text-gray-400">•</span>
                  <a 
                    href="https://github.com/christianonoh" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-dark text-sm transition-colors duration-200"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              {/* Mobile share buttons */}
              <div className="lg:hidden">
                <ShareButtons 
                  title={post.title} 
                  excerpt={post.excerpt}
                />
              </div>

              {/* Related posts placeholder */}
              <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-dark dark:text-light mb-3">
                  More Articles
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/blog"
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors duration-200"
                  >
                    View all blog posts →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer navigation */}
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Posts
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Share this article:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:text-accent transition-colors duration-200"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:text-accent transition-colors duration-200"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <NewsletterBanner />
    </Transition>
  );
}