import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schema for AI Generator — JSON-LD Structured Data",
  description: "Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.",
  keywords: ["schema generator", "JSON-LD schema", "AI schema markup", "structured data generator", "Google AI Overviews schema"],
  alternates: {
    canonical: "https://geokit.site/tools/schema-generator",
  },
  openGraph: {
    title: "Schema for AI Generator — JSON-LD Structured Data",
    description: "Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.",
    type: "website",
    url: "https://geokit.site/tools/schema-generator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Schema for AI Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schema for AI Generator — JSON-LD Structured Data",
    description: "Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.",
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/schema-generator/#webapp",
      "name": "Schema for AI Generator",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": "https://geokit.site/tools/schema-generator",
      "description": "Create AI-friendly JSON-LD schema markup for WebSite, WebApplication, Article, Product, and FAQPage.",
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
      "@id": "https://geokit.site/tools/schema-generator/#breadcrumb",
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
          "name": "Schema for AI Generator",
          "item": "https://geokit.site/tools/schema-generator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://geokit.site/tools/schema-generator/#howto",
      "name": "How to Generate JSON-LD Schema for AI Engines",
      "description": "Step-by-step guide to generating valid JSON-LD structured data.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Select Schema Type",
          "text": "Choose from WebSite, WebApplication, Article, Product, or FAQPage."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Fill in Entity Fields",
          "text": "Enter name, description, author, prices, or Q&A content."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Embed Script in HTML",
          "text": "Copy the output and paste into your page head as <script type='application/ld+json'>."
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

