import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geokit.site";

  // Static dates: update when the corresponding page content actually changes.
  const corePages = [
    { route: "", lastModified: "2026-07-22", changeFrequency: "weekly" as const, priority: 1.0 },
    { route: "/about", lastModified: "2026-07-22", changeFrequency: "monthly" as const, priority: 0.7 },
    { route: "/badge", lastModified: "2026-07-22", changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  // High-value core tools get priority 0.9
  const highPriorityTools = [
    "/tools/llms-txt-generator",
    "/tools/ai-readiness-checker",
    "/tools/geo-score",
    "/tools/ai-search-grader",
    "/tools/ai-robots-txt-generator",
    "/tools/schema-generator",
  ].map((route) => ({
    route,
    lastModified: "2026-07-22",
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Standard utility tools get priority 0.8
  const standardTools = [
    "/tools/llms-txt-validator",
    "/tools/geo-checklist",
    "/tools/ai-sitemap-generator",
    "/tools/meta-tag-generator",
    "/tools/qa-content-formatter",
    "/tools/ai-crawler-tester",
    "/tools/schema-validator",
    "/tools/sitemap-validator",
  ].map((route) => ({
    route,
    lastModified: "2026-07-22",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Machine-readable GEO assets included in sitemap for AI discovery
  const machineAssets = [
    { route: "/llms.txt", lastModified: "2026-07-22", changeFrequency: "weekly" as const, priority: 0.9 },
    { route: "/llms-full.txt", lastModified: "2026-07-22", changeFrequency: "weekly" as const, priority: 0.9 },
    { route: "/openapi.yaml", lastModified: "2026-07-22", changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const legalPages = [
    { route: "/privacy", lastModified: "2026-07-17", changeFrequency: "yearly" as const, priority: 0.3 },
    { route: "/terms", lastModified: "2026-07-17", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return [...corePages, ...highPriorityTools, ...standardTools, ...machineAssets, ...legalPages].map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}

