import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Search Grader — Check Your Brand Visibility in LLM Answers',
  description: 'Benchmark brand visibility and share of voice across 6 major AI search models.',
  alternates: {
    canonical: 'https://geokit.site/tools/ai-search-grader',
  },
  openGraph: {
    title: 'AI Search Grader — Check Your Brand Visibility in LLM Answers',
    description: 'Benchmark brand visibility and share of voice across 6 major AI search models.',
    type: "website",
    url: 'https://geokit.site/tools/ai-search-grader',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'AI Search Grader',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'AI Search Grader — Check Your Brand Visibility in LLM Answers',
    description: 'Benchmark brand visibility and share of voice across 6 major AI search models.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'AI Search Grader',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/ai-search-grader',
  "description": 'Benchmark brand visibility and share of voice across 6 major AI search models.',
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
      "name": 'AI Search Grader',
      "item": 'https://geokit.site/tools/ai-search-grader'
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
