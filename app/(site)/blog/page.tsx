import { getBlogPosts, getFeaturedBlogPosts } from "@/sanity/sanity.fetch";
import AnimatedText from "@/components/shared/AnimatedText";
import Transition from "@/components/shared/Transition";
import BlogCard from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest thoughts on web development, technology, and career insights.",
};

export default async function BlogPage() {
  const [blogPosts, featuredPosts] = await Promise.all([
    getBlogPosts(),
    getFeaturedBlogPosts(),
  ]);

  return (
    <Transition>
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:px-20 py-16">
        <div className="mb-16">
          <AnimatedText
            text="My Blog"
            className="!text-5xl md:!text-6xl lg:!text-7xl mb-8"
          />
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Sharing insights, tutorials, and thoughts on web development, technology, and my journey as a developer.
          </p>
        </div>

        {featuredPosts && featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-dark dark:text-light mb-8">
              Featured Posts
            </h2>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedBlogCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-8">
            All Posts
          </h2>
          {blogPosts && blogPosts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}
        </section>
      </main>
    </Transition>
  );
}