import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Checker — Free GEO Site Audit",
  description: "Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.",
  keywords: ["AI readiness checker", "GEO site audit", "AI SEO score", "llms.txt check", "AI crawler audit"],
  alternates: {
    canonical: "https://geokit.site/tools/ai-readiness-checker",
  },
  openGraph: {
    title: "AI Readiness Checker — Free GEO Site Audit",
    description: "Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.",
    type: "website",
    url: "https://geokit.site/tools/ai-readiness-checker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Readiness Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Readiness Checker — Free GEO Site Audit",
    description: "Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.",
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/ai-readiness-checker/#webapp",
      "name": "AI Readiness Checker",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": "https://geokit.site/tools/ai-readiness-checker",
      "description": "Audit any URL for AI search readiness. Get a 0-100 GEO score analyzing robots.txt, sitemaps, metadata, and structured data.",
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
      "@id": "https://geokit.site/tools/ai-readiness-checker/#breadcrumb",
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
          "name": "AI Readiness Checker",
          "item": "https://geokit.site/tools/ai-readiness-checker"
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://geokit.site/tools/ai-readiness-checker/#howto",
      "name": "How to Audit a Website for AI Search Readiness",
      "description": "Step-by-step guide to testing a URL with GEOKit AI Readiness Checker.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Enter Domain URL",
          "text": "Paste your domain URL (e.g., https://example.com) into the audit bar."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Run Diagnostic Scan",
          "text": "Click Check Readiness to audit robots.txt, llms.txt, sitemap XML, and structured data."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Review GEO Score & Fix Recommendations",
          "text": "Inspect your 0-100 breakdown and follow actionable steps to improve AI search citation rates."
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

