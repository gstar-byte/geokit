import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sitemap Validator & Checker — XML Compliance & Broken Link Audit',
  description: 'Enter your sitemap URL to check XML syntax compliance, sitemaps.org format, file weight, and run instant HTTP status checks on page URLs to find broken links and redirect waste.',
  alternates: {
    canonical: 'https://geokit.site/tools/sitemap-validator',
  },
  openGraph: {
    title: 'Sitemap Validator & Checker — XML Compliance & Broken Link Audit',
    description: 'Enter your sitemap URL to check XML syntax compliance, sitemaps.org format, file weight, and run instant HTTP status checks on page URLs to find broken links and redirect waste.',
    type: "website",
    url: 'https://geokit.site/tools/sitemap-validator',
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: 'Sitemap Validator & Checker',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Sitemap Validator & Checker — XML Compliance & Broken Link Audit',
    description: 'Enter your sitemap URL to check XML syntax compliance, sitemaps.org format, file weight, and run instant HTTP status checks on page URLs to find broken links and redirect waste.',
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": 'Sitemap Validator & Checker',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": 'https://geokit.site/tools/sitemap-validator',
  "description": 'Enter your sitemap URL to check XML syntax compliance, sitemaps.org format, file weight, and run instant HTTP status checks on page URLs to find broken links and redirect waste.',
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
      "name": 'Sitemap Validator & Checker',
      "item": 'https://geokit.site/tools/sitemap-validator'
    }
  ]
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does a Sitemap Validator check?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It checks three critical layers: XML Namespace Compliance (ensuring sitemaps.org standards are defined), File Integrity & Size (under 50,000 URLs / 50MB), and HTTP Status Audit (verifying if listed URLs return 200 OK rather than redirects or errors)."
      }
    },
    {
      "@type": "Question",
      "name": "Why does a missing XML schema namespace break indexing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "XML parsers require a formal namespace definition (e.g. xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\") to understand tags like <loc> and <lastmod>. Without it, the file parses as generic XML, preventing search bots from recognizing it as a sitemap."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between a Sitemap and a Sitemap Index?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A single Sitemap contains up to 50,000 page URLs. If your site has more pages, you must divide them into multiple files and list them in a Sitemap Index file (which links to the individual sitemaps). Our validator detects and parses both types."
      }
    },
    {
      "@type": "Question",
      "name": "Why are 301 redirects and 404 errors bad in sitemaps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your sitemap is a declaration of the pages you want indexed. Including 404 pages or 301 redirects forces bots to waste crawl budget on useless requests. Sitemaps should exclusively contain clean canonical endpoints."
      }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {children}
    </>
  );
}
