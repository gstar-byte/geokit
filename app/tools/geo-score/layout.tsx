import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEO Score — Content AI Citability Grader | Free GEO Tools",
  description: "Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it. Analyze direct answer potential, structure, citation worthiness, and more.",
  keywords: ["GEO score", "AI citability grader", "AI search score", "RAG content optimizer", "Generative Engine Optimization score"],
  alternates: {
    canonical: "https://geokit.site/tools/geo-score",
  },
  openGraph: {
    title: "GEO Score — Content AI Citability Grader | Free GEO Tools",
    description: "Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it. Analyze direct answer potential, structure, citation worthiness, and more.",
    type: "website",
    url: "https://geokit.site/tools/geo-score",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GEO Score — Content AI Citability Grader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GEO Score — Content AI Citability Grader | Free GEO Tools",
    description: "Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it. Analyze direct answer potential, structure, citation worthiness, and more.",
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/geo-score/#webapp",
      "name": "GEO Score",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": "https://geokit.site/tools/geo-score",
      "description": "Paste your content and get an instant 0–100 GEO Score measuring how likely AI search engines are to cite it.",
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
      "@id": "https://geokit.site/tools/geo-score/#breadcrumb",
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
    },
    {
      "@type": "HowTo",
      "@id": "https://geokit.site/tools/geo-score/#howto",
      "name": "How to Measure Content AI Citability",
      "description": "Step-by-step guide to calculating a GEO Score for your articles or docs.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Paste Content or Article Text",
          "text": "Copy and paste your markdown or raw text into the input box."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Analyze GEO Score",
          "text": "Get an instant 0–100 score analyzing direct answer likelihood, structure, and citations."
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

