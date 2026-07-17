import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Badge — GEOKit",
  description:
    "Get a free embeddable badge to display your website's AI readiness score. Build trust and signal your GEO readiness to web crawlers.",
  alternates: {
    canonical: "https://geokit.site/badge",
  },
  openGraph: {
    title: "AI Readiness Badge — GEOKit",
    description:
      "Get a free embeddable badge to display your website's AI readiness score. Build trust and signal your GEO readiness to web crawlers.",
    type: "website",
    url: "https://geokit.site/badge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Readiness Badge — GEOKit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Readiness Badge — GEOKit",
    description:
      "Get a free embeddable badge to display your website's AI readiness score. Build trust and signal your GEO readiness to web crawlers.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AI Readiness Badge",
  "url": "https://geokit.site/badge",
  "description":
    "Showcase your website's AI readiness score with a free, custom embeddable badge.",
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
      "name": "Badge",
      "item": "https://geokit.site/badge"
    }
  ]
};

export default function BadgeLayout({ children }: { children: React.ReactNode }) {
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
