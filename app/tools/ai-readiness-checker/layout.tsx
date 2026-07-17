import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Readiness Checker — Free GEO Site Audit',
  description: 'Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.',
  alternates: {
    canonical: 'https://geokit.site/tools/ai-readiness-checker',
  },
  openGraph: {
    title: 'AI Readiness Checker — Free GEO Site Audit',
    description: 'Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.',
    type: "website",
    url: 'https://geokit.site/tools/ai-readiness-checker',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'AI Readiness Checker',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'AI Readiness Checker — Free GEO Site Audit',
    description: 'Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'AI Readiness Checker',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/ai-readiness-checker',
  "description": 'Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.',
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
      "name": 'AI Readiness Checker',
      "item": 'https://geokit.site/tools/ai-readiness-checker'
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
