import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/sanity.image";

interface FeaturedBlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: {
      alt: string;
      image: any;
    };
    category?: string;
    tags?: string[];
    publishedAt: string;
    readingTime?: number;
  };
}

export default function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <article className="group relative h-full rounded-2xl overflow-hidden bg-light dark:bg-dark/50 border border-dark/[0.06] dark:border-light/[0.06] transition-all duration-500 hover:border-accent/30 dark:hover:border-accent/20 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]">
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col h-full"
      >
        {/* Image */}
        {post.coverImage?.image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={
                urlForImage(post.coverImage.image)
                  ?.width(600)
                  .height(375)
                  .url() || ""
              }
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Top-left badges — float over image */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent text-white backdrop-blur-sm">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1.5l2 4.5 5 .5-3.5 3.5 1 5L8 12.5 3.5 15l1-5L1 6.5 6 6z" />
                </svg>
                Featured
              </span>
              {post.category && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-dark/60 text-white backdrop-blur-sm">
                  {post.category}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 sm:p-6">
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-bold font-outfit text-dark dark:text-light leading-snug mb-2.5 transition-colors duration-300 group-hover:text-accent line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray leading-relaxed line-clamp-2 mb-auto">
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark/[0.04] dark:border-light/[0.04]">
            <div className="flex items-center gap-3 text-xs text-gray">
              <time dateTime={post.publishedAt}>{publishedDate}</time>
              {post.readingTime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray/40" />
                  <span>{post.readingTime} min read</span>
                </>
              )}
            </div>

            {/* Arrow */}
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-dark/[0.04] dark:bg-light/[0.06] text-gray transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:translate-x-0.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}