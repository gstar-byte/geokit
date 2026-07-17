import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'llms.txt Generator — Free GEO Tools for AI Optimization',
  description: 'Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.',
  alternates: {
    canonical: 'https://geokit.site/tools/llms-txt-generator',
  },
  openGraph: {
    title: 'llms.txt Generator — Free GEO Tools for AI Optimization',
    description: 'Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.',
    type: "website",
    url: 'https://geokit.site/tools/llms-txt-generator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'llms.txt Generator',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'llms.txt Generator — Free GEO Tools for AI Optimization',
    description: 'Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'llms.txt Generator',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/llms-txt-generator',
  "description": 'Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.',
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
      "name": 'llms.txt Generator',
      "item": 'https://geokit.site/tools/llms-txt-generator'
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
