import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geokit.site";

  const routes = [
    "",
    "/about",
    "/tools/llms-txt-generator",
    "/tools/ai-robots-txt-generator",
    "/tools/schema-generator",
    "/tools/ai-readiness-checker",
    "/tools/llms-txt-validator",
    "/tools/geo-checklist",
    "/tools/ai-sitemap-generator",
    "/tools/meta-tag-generator",
    "/tools/qa-content-formatter",
    "/tools/ai-crawler-tester",
    "/badge",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/about" ? 0.6 : 0.8,
  }));
}
