import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/llms.txt",
          "/llms-full.txt",
          "/openapi.yaml",
          "/.well-known/ai-plugin.json",
        ],
        // Block API routes, Next.js internals, and parameterised URLs
        // to conserve Bing crawl quota (fixes "Limited crawl capacity" warning)
        disallow: [
          "/api/",          // All server-side API endpoints — no indexing value
          "/_next/",        // Next.js static/runtime chunks
          "/cdn-cgi/",      // Cloudflare internal paths
          "/*?*",           // Any URL with query parameters (prevents duplicate content)
        ],
      },
      // AI search & training crawlers — explicitly allowed for GEO visibility
      // These bots index for AI answers, not for crawl-quota-sensitive engines
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "ClaudeUser", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "PerplexityUser", allow: "/" },
      { userAgent: "DeepSeekBot", allow: "/" },
      { userAgent: "DeepSeek", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-Llama", allow: "/" },
      { userAgent: "LlamaBot", allow: "/" },
      { userAgent: "MistralBot", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "DuckAssistBot", allow: "/" },
      { userAgent: "YouBot", allow: "/" },
    ],
    sitemap: "https://geokit.site/sitemap.xml",
  };
}


