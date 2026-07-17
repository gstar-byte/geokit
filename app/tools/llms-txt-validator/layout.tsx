import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'llms.txt Validator — Check Specification Compliance',
  description: 'Validate your llms.txt syntax, markdown links, H1 headers, and section structure against official specifications.',
  alternates: {
    canonical: 'https://geokit.site/tools/llms-txt-validator',
  },
  openGraph: {
    title: 'llms.txt Validator — Check Specification Compliance',
    description: 'Validate your llms.txt syntax, markdown links, H1 headers, and section structure against official specifications.',
    type: "website",
    url: 'https://geokit.site/tools/llms-txt-validator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'llms.txt Validator',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'llms.txt Validator — Check Specification Compliance',
    description: 'Validate your llms.txt syntax, markdown links, H1 headers, and section structure against official specifications.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'llms.txt Validator',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/llms-txt-validator',
  "description": 'Validate your llms.txt syntax, markdown links, H1 headers, and section structure against official specifications.',
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
      "name": 'llms.txt Validator',
      "item": 'https://geokit.site/tools/llms-txt-validator'
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
