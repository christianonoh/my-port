import { getProjects } from "@/sanity/sanity.fetch";
import siteMetadata from "@/utils/siteMetaData";

export default async function sitemap() {
  const projects = await getProjects();

  const projectMaps = projects.map((project) => ({
    url: `${siteMetadata.siteUrl}/projects/${project.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const routes = ["", "/about", "/projects"].map((route) => ({
    url: `${siteMetadata.siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 1,
  }));

  return [...routes, ...projectMaps];
}
