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
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative bg-white dark:bg-dark rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-800/20 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row h-full">
        {post.coverImage?.image && (
          <div className="sm:w-2/5 aspect-video sm:aspect-square overflow-hidden">
            <Image
              src={urlForImage(post.coverImage.image)?.width(600).height(400).url() || ""}
              alt={post.coverImage.alt || post.title}
              width={600}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-accent text-white px-2 py-1 rounded text-xs font-semibold">
                Featured
              </span>
              {post.category && (
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
                  {post.category}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-dark dark:text-light mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">
            <time dateTime={post.publishedAt}>
              {publishedDate}
            </time>
            {post.readingTime && (
              <span>{post.readingTime} min read</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}