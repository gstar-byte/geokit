import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Robots.txt Generator — Control LLM Crawlers',
  description: 'Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, and PerplexityBot.',
  alternates: {
    canonical: 'https://geokit.site/tools/ai-robots-txt-generator',
  },
  openGraph: {
    title: 'AI Robots.txt Generator — Control LLM Crawlers',
    description: 'Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, and PerplexityBot.',
    type: "website",
    url: 'https://geokit.site/tools/ai-robots-txt-generator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'AI Robots.txt Generator',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'AI Robots.txt Generator — Control LLM Crawlers',
    description: 'Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, and PerplexityBot.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'AI Robots.txt Generator',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/ai-robots-txt-generator',
  "description": 'Generate a production-ready robots.txt to allow or block AI training bots like GPTBot, ClaudeBot, and PerplexityBot.',
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "GEOKit",
    "url": "https://geokit.site"
  }
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
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
      "name": 'AI Robots.txt Generator',
      "item": 'https://geokit.site/tools/ai-robots-txt-generator'
    }
  ]
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  );
}
