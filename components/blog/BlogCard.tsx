import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/sanity.image";

interface BlogCardProps {
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
  featured?: boolean;
}

export default function BlogCard({ post }: BlogCardProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <article className="group relative h-full rounded-2xl overflow-hidden bg-light dark:bg-dark/50 border border-dark/[0.06] dark:border-light/[0.06] transition-all duration-500 hover:border-accent/30 dark:hover:border-accent/20 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
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
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Category badge — top left over image */}
            {post.category && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-dark/60 text-white backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col p-5 sm:p-6">
          {/* Title */}
          <h2 className="text-lg font-bold text-dark dark:text-light leading-snug mb-2.5 transition-colors duration-300 group-hover:text-accent line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray leading-relaxed line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-auto">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-dark/[0.04] dark:bg-light/[0.06] text-gray"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-0.5 text-[11px] text-gray/60">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
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