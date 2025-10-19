import { getProjects, getBlogPosts } from "@/sanity/sanity.fetch";
import siteMetadata from "@/utils/siteMetaData";

export default async function sitemap() {
  const [projects, blogPosts] = await Promise.all([
    getProjects(),
    getBlogPosts(),
  ]);

  const projectMaps = projects.map((project) => ({
    url: `${siteMetadata.siteUrl}/projects/${project.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Add blog listing page
  const blogIndex = {
    url: `${siteMetadata.siteUrl}/blog`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  };

  // Add individual blog posts
  const blogPostMaps = blogPosts?.map((post) => ({
    url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt || new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  })) || [];

  const routes = ["", "/about", "/projects"].map((route) => ({
    url: `${siteMetadata.siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 1,
  }));

  return [...routes, blogIndex, ...projectMaps, ...blogPostMaps];
}
