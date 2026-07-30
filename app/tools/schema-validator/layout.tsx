import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Schema Validator & Rich Results Preview — Free GEO Tools for AI Optimization',
  description: 'Paste your JSON-LD structured data to validate syntax, check required fields, and preview how it will appear in Google Rich Results and AI search.',
  keywords: ["schema validator", "JSON-LD validator", "structured data checker", "Google Rich Results preview", "schema markup validator"],
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

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/schema-validator/#webapp",
      "name": 'Schema Validator & Rich Results Preview',
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": 'https://geokit.site/tools/schema-validator',
      "description": 'Paste your JSON-LD structured data to validate syntax, check required fields, and preview how it will appear in Google Rich Results and AI search.',
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
      "@id": "https://geokit.site/tools/schema-validator/#breadcrumb",
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
          "name": 'Schema Validator & Rich Results Preview',
          "item": 'https://geokit.site/tools/schema-validator'
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
