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

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group bg-white dark:bg-dark rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-800/20 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <Link href={`/blog/${post.slug}`}>
        {post.coverImage?.image && (
          <div className="aspect-video overflow-hidden">
            <Image
              src={urlForImage(post.coverImage.image)?.width(600).height(400).url() || ""}
              alt={post.coverImage.alt || post.title}
              width={600}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            {post.category && (
              <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-medium">
                {post.category}
              </span>
            )}
            <time
              dateTime={post.publishedAt}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {publishedDate}
            </time>
            {post.readingTime && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {post.readingTime} min read
                </span>
              </>
            )}
          </div>

          <h2 className="text-xl font-bold text-dark dark:text-light mb-3 group-hover:text-accent transition-colors duration-200 line-clamp-2">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-gray-400 dark:text-gray-400 text-xs">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}