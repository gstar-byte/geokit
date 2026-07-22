import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Robots.txt Generator — Control LLM Crawlers",
  description: "Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, PerplexityBot, and DeepSeekBot.",
  keywords: ["AI robots.txt generator", "GPTBot allow", "ClaudeBot block", "AI crawlers robots.txt", "GEO robots.txt"],
  alternates: {
    canonical: "https://geokit.site/tools/ai-robots-txt-generator",
  },
  openGraph: {
    title: "AI Robots.txt Generator — Control LLM Crawlers",
    description: "Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, PerplexityBot, and DeepSeekBot.",
    type: "website",
    url: "https://geokit.site/tools/ai-robots-txt-generator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Robots.txt Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Robots.txt Generator — Control LLM Crawlers",
    description: "Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, PerplexityBot, and DeepSeekBot.",
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/ai-robots-txt-generator/#webapp",
      "name": "AI Robots.txt Generator",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": "https://geokit.site/tools/ai-robots-txt-generator",
      "description": "Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, PerplexityBot, and DeepSeekBot.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://geokit.site/#organization",
        "name": "GEOKit",
        "url": "https://geokit.site",
        "logo": "https://geokit.site/icon-512.png"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://geokit.site/tools/ai-robots-txt-generator/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://geokit.site"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tools",
          "item": "https://geokit.site/#tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "AI Robots.txt Generator",
          "item": "https://geokit.site/tools/ai-robots-txt-generator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://geokit.site/tools/ai-robots-txt-generator/#howto",
      "name": "How to Build an AI-Friendly Robots.txt",
      "description": "Step-by-step guide to configuring AI crawler access rules using GEOKit.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Select Crawler Rules",
          "text": "Choose whether to Allow or Disallow specific AI scrapers like GPTBot, ClaudeBot, or DeepSeekBot."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Specify Sitemap and LLM paths",
          "text": "Add your sitemap URL and include explicit rules for llms.txt."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Copy or Download robots.txt",
          "text": "Copy the generated rules and save as robots.txt in your web root directory."
        }
      ]
    }
  ]
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      {children}
    </>
  );
}

