import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Schema for AI Generator — JSON-LD Structured Data',
  description: 'Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.',
  alternates: {
    canonical: 'https://geokit.site/tools/schema-generator',
  },
  openGraph: {
    title: 'Schema for AI Generator — JSON-LD Structured Data',
    description: 'Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.',
    type: "website",
    url: 'https://geokit.site/tools/schema-generator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'Schema for AI Generator',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Schema for AI Generator — JSON-LD Structured Data',
    description: 'Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'Schema for AI Generator',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/schema-generator',
  "description": 'Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.',
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
      "name": 'Schema for AI Generator',
      "item": 'https://geokit.site/tools/schema-generator'
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
