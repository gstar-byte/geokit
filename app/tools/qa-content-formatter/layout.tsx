import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Q&A Content Formatter — Structure Text for AI Answers',
  description: 'Transform text into high-citation Q&A formats optimized for LLM answer extraction and RAG pipelines.',
  keywords: ["Q&A content formatter", "AI content formatter", "RAG content optimizer", "LLM answer extraction", "Q&A structure for AI"],
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

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/qa-content-formatter/#webapp",
      "name": 'Q&A Content Formatter',
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": 'https://geokit.site/tools/qa-content-formatter',
      "description": 'Transform text into high-citation Q&A formats optimized for LLM answer extraction and RAG pipelines.',
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
      "@id": "https://geokit.site/tools/qa-content-formatter/#breadcrumb",
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
          "name": 'Q&A Content Formatter',
          "item": 'https://geokit.site/tools/qa-content-formatter'
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
