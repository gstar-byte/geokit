import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — GEOKit",
  description:
    "Terms of Service for GEOKit — the free GEO toolkit for AI search optimization. Free for personal and commercial use, no signup required.",
  alternates: {
    canonical: "https://geokit.site/terms",
  },
  openGraph: {
    title: "Terms of Service — GEOKit",
    description:
      "Terms of Service for GEOKit — the free GEO toolkit for AI search optimization. Free for personal and commercial use, no signup required.",
    type: "website",
    url: "https://geokit.site/terms",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Terms of Service — GEOKit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — GEOKit",
    description:
      "Terms of Service for GEOKit — the free GEO toolkit for AI search optimization. Free for personal and commercial use, no signup required.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Terms of Service — GEOKit",
  "url": "https://geokit.site/terms",
  "description":
    "Terms of Service for GEOKit — the free GEO toolkit for AI search optimization. Free for personal and commercial use, no signup required.",
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
      "name": "Terms of Service",
      "item": "https://geokit.site/terms"
    }
  ]
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
