import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Q&A Content Formatter — Structure Text for AI Answers',
  description: 'Transform text into high-citation Q&A formats optimized for LLM answer extraction and RAG pipelines.',
  alternates: {
    canonical: 'https://geokit.site/tools/qa-content-formatter',
  },
  openGraph: {
    title: 'Q&A Content Formatter — Structure Text for AI Answers',
    description: 'Transform text into high-citation Q&A formats optimized for LLM answer extraction and RAG pipelines.',
    type: "website",
    url: 'https://geokit.site/tools/qa-content-formatter',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'Q&A Content Formatter',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Q&A Content Formatter — Structure Text for AI Answers',
    description: 'Transform text into high-citation Q&A formats optimized for LLM answer extraction and RAG pipelines.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'Q&A Content Formatter',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/qa-content-formatter',
  "description": 'Transform text into high-citation Q&A formats optimized for LLM answer extraction and RAG pipelines.',
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
      "name": 'Q&A Content Formatter',
      "item": 'https://geokit.site/tools/qa-content-formatter'
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
