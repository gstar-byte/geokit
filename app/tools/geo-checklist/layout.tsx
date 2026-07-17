import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'GEO Checklist — Step-by-Step AI Optimization Guide',
  description: 'Follow an interactive checklist to optimize your website for ChatGPT, Perplexity, and Google AI Overviews.',
  alternates: {
    canonical: 'https://geokit.site/tools/geo-checklist',
  },
  openGraph: {
    title: 'GEO Checklist — Step-by-Step AI Optimization Guide',
    description: 'Follow an interactive checklist to optimize your website for ChatGPT, Perplexity, and Google AI Overviews.',
    type: "website",
    url: 'https://geokit.site/tools/geo-checklist',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'GEO Checklist',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'GEO Checklist — Step-by-Step AI Optimization Guide',
    description: 'Follow an interactive checklist to optimize your website for ChatGPT, Perplexity, and Google AI Overviews.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'GEO Checklist',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/geo-checklist',
  "description": 'Follow an interactive checklist to optimize your website for ChatGPT, Perplexity, and Google AI Overviews.',
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
      "name": 'GEO Checklist',
      "item": 'https://geokit.site/tools/geo-checklist'
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
