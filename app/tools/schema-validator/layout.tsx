import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Schema Validator & Rich Results Preview — Free GEO Tools for AI Optimization',
  description: 'Paste your JSON-LD structured data to validate syntax, check required fields, and preview how it will appear in Google Rich Results and AI search.',
  alternates: {
    canonical: 'https://geokit.site/tools/schema-validator',
  },
  openGraph: {
    title: 'Schema Validator & Rich Results Preview — Free GEO Tools for AI Optimization',
    description: 'Paste your JSON-LD structured data to validate syntax, check required fields, and preview how it will appear in Google Rich Results and AI search.',
    type: "website",
    url: 'https://geokit.site/tools/schema-validator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'Schema Validator & Rich Results Preview',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Schema Validator & Rich Results Preview — Free GEO Tools for AI Optimization',
    description: 'Paste your JSON-LD structured data to validate syntax, check required fields, and preview how it will appear in Google Rich Results and AI search.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'Schema Validator & Rich Results Preview',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/schema-validator',
  "description": 'Paste your JSON-LD structured data to validate syntax, check required fields, and preview how it will appear in Google Rich Results and AI search.',
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
      "name": 'Schema Validator & Rich Results Preview',
      "item": 'https://geokit.site/tools/schema-validator'
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
