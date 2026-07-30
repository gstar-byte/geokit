import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Sitemap Generator — XML Sitemaps for LLMs',
  description: 'Build XML sitemaps with custom priorities and update frequencies optimized for AI scrapers.',
  keywords: ["AI sitemap generator", "XML sitemap for AI", "LLM sitemap", "AI crawler sitemap", "sitemap priority generator"],
  alternates: {
    canonical: 'https://geokit.site/tools/ai-sitemap-generator',
  },
  openGraph: {
    title: 'AI Sitemap Generator — XML Sitemaps for LLMs',
    description: 'Build XML sitemaps with custom priorities and update frequencies optimized for AI scrapers.',
    type: "website",
    url: 'https://geokit.site/tools/ai-sitemap-generator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'AI Sitemap Generator',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'AI Sitemap Generator — XML Sitemaps for LLMs',
    description: 'Build XML sitemaps with custom priorities and update frequencies optimized for AI scrapers.',
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/ai-sitemap-generator/#webapp",
      "name": 'AI Sitemap Generator',
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": 'https://geokit.site/tools/ai-sitemap-generator',
      "description": 'Build XML sitemaps with custom priorities and update frequencies optimized for AI scrapers.',
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
      "@id": "https://geokit.site/tools/ai-sitemap-generator/#breadcrumb",
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
          "name": 'AI Sitemap Generator',
          "item": 'https://geokit.site/tools/ai-sitemap-generator'
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
