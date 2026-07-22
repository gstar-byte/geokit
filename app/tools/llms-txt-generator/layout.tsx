import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "llms.txt Generator — Free GEO Tools for AI Optimization",
  description: "Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.",
  keywords: ["llms.txt generator", "llms.txt creator", "GEO tools", "AI sitemap", "llms.txt specification"],
  alternates: {
    canonical: "https://geokit.site/tools/llms-txt-generator",
  },
  openGraph: {
    title: "llms.txt Generator — Free GEO Tools for AI Optimization",
    description: "Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.",
    type: "website",
    url: "https://geokit.site/tools/llms-txt-generator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "llms.txt Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "llms.txt Generator — Free GEO Tools for AI Optimization",
    description: "Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.",
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/llms-txt-generator/#webapp",
      "name": "llms.txt Generator",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": "https://geokit.site/tools/llms-txt-generator",
      "description": "Generate a standardized llms.txt file to help LLMs and AI crawlers understand your site structure and index relevant content.",
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
      "@id": "https://geokit.site/tools/llms-txt-generator/#breadcrumb",
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
          "name": "llms.txt Generator",
          "item": "https://geokit.site/tools/llms-txt-generator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://geokit.site/tools/llms-txt-generator/#howto",
      "name": "How to Generate and Deploy llms.txt",
      "description": "Step-by-step guide to generating and serving a standard llms.txt file for AI search engines.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Input Site Metadata",
          "text": "Enter your website title, blockquote summary, and section headings in the generator form."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Add Important Page Links",
          "text": "Add URLs and descriptive notes for key documentation pages."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Download or Copy Output",
          "text": "Copy the generated markdown or download it directly as llms.txt."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Deploy to Root Directory",
          "text": "Upload the llms.txt file to your site's root directory so it is accessible at https://yourdomain.com/llms.txt."
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://geokit.site/tools/llms-txt-generator/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the llms.txt standard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "llms.txt is a markdown specification providing a lightweight table of contents for LLM scrapers to discover site content without HTML/JS overhead."
          }
        },
        {
          "@type": "Question",
          "name": "Where should llms.txt be placed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "llms.txt must be served over HTTPS from your root web directory (e.g. https://example.com/llms.txt)."
          }
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

