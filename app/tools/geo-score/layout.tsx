import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'GEO Score — Content AI Citability Grader | Free GEO Tools',
  description: 'Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it. Analyze direct answer potential, structure, citation worthiness, and more.',
  alternates: {
    canonical: 'https://geokit.site/tools/geo-score',
  },
  openGraph: {
    title: 'GEO Score — Content AI Citability Grader | Free GEO Tools',
    description: 'Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it. Analyze direct answer potential, structure, citation worthiness, and more.',
    type: "website",
    url: 'https://geokit.site/tools/geo-score',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'GEO Score — Content AI Citability Grader',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'GEO Score — Content AI Citability Grader | Free GEO Tools',
    description: 'Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it. Analyze direct answer potential, structure, citation worthiness, and more.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GEO Score — Content AI Citability Grader",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/geo-score",
  "description": "Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it. Analyze direct answer potential, structure, citation worthiness, and more.",
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
      "name": "GEO Score",
      "item": "https://geokit.site/tools/geo-score"
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
