import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Meta Tag Generator — OpenGraph & AI Citation Meta Tags',
  description: 'Generate OpenGraph, Twitter Cards, and AI-specific citation meta tags for your site.',
  alternates: {
    canonical: 'https://geokit.site/tools/meta-tag-generator',
  },
  openGraph: {
    title: 'Meta Tag Generator — OpenGraph & AI Citation Meta Tags',
    description: 'Generate OpenGraph, Twitter Cards, and AI-specific citation meta tags for your site.',
    type: "website",
    url: 'https://geokit.site/tools/meta-tag-generator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'Meta Tag Generator',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Meta Tag Generator — OpenGraph & AI Citation Meta Tags',
    description: 'Generate OpenGraph, Twitter Cards, and AI-specific citation meta tags for your site.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'Meta Tag Generator',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/meta-tag-generator',
  "description": 'Generate OpenGraph, Twitter Cards, and AI-specific citation meta tags for your site.',
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
      "name": 'Meta Tag Generator',
      "item": 'https://geokit.site/tools/meta-tag-generator'
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
