import { getBlogPost, getBlogPosts } from "@/sanity/sanity.fetch";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Transition from "@/components/shared/Transition";
import { Metadata } from "next";
import { urlForImage } from "@/sanity/sanity.image";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  
  return posts?.map((post) => ({
    slug: post.slug,
  })) || [];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
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
  const post = await getBlogPost(params.slug);

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
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:px-20 py-16">
        <article>
          <header className="mb-12 text-center">
            <div className="mb-6">
              <Link
                href="/blog"
                className="text-accent hover:text-accent-dark font-medium"
              >
                ← Back to Blog
              </Link>
            </div>
            
            {post.coverImage?.image && (
              <div className="mb-8">
                <Image
                  src={urlForImage(post.coverImage.image)?.url() || ""}
                  alt={post.coverImage.alt || post.title}
                  width={800}
                  height={400}
                  className="rounded-lg w-full h-auto shadow-lg"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark dark:text-light mb-6">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={post.publishedAt}>{publishedDate}</time>
              {post.readingTime && (
                <>
                  <span>•</span>
                  <span>{post.readingTime} min read</span>
                </>
              )}
              {post.category && (
                <>
                  <span>•</span>
                  <span className="bg-accent/10 text-accent px-2 py-1 rounded">
                    {post.category}
                  </span>
                </>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText value={post.content} components={components} />
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors duration-200"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </main>
    </Transition>
  );
}