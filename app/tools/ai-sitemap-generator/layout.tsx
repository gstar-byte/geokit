import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Sitemap Generator — XML Sitemaps for LLMs',
  description: 'Build XML sitemaps with custom priorities and update frequencies optimized for AI scrapers.',
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'AI Sitemap Generator',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/ai-sitemap-generator',
  "description": 'Build XML sitemaps with custom priorities and update frequencies optimized for AI scrapers.',
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
      "name": 'AI Sitemap Generator',
      "item": 'https://geokit.site/tools/ai-sitemap-generator'
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
