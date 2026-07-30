import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Crawler Tester — Test How GPTBot & ClaudeBot See Your Page',
  description: 'Simulate AI web crawlers to test if your content is extractable by LLM web scrapers.',
  keywords: ["AI crawler tester", "GPTBot simulation", "ClaudeBot crawl test", "AI scraper test", "LLM content extraction"],
  alternates: {
    canonical: 'https://geokit.site/tools/ai-crawler-tester',
  },
  openGraph: {
    title: 'AI Crawler Tester — Test How GPTBot & ClaudeBot See Your Page',
    description: 'Simulate AI web crawlers to test if your content is extractable by LLM web scrapers.',
    type: "website",
    url: 'https://geokit.site/tools/ai-crawler-tester',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'AI Crawler Tester',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'AI Crawler Tester — Test How GPTBot & ClaudeBot See Your Page',
    description: 'Simulate AI web crawlers to test if your content is extractable by LLM web scrapers.',
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/ai-crawler-tester/#webapp",
      "name": 'AI Crawler Tester',
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": 'https://geokit.site/tools/ai-crawler-tester',
      "description": 'Simulate AI web crawlers to test if your content is extractable by LLM web scrapers.',
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
      "@id": "https://geokit.site/tools/ai-crawler-tester/#breadcrumb",
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
          "item": "https://geokit.site"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": 'AI Crawler Tester',
          "item": 'https://geokit.site/tools/ai-crawler-tester'
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
