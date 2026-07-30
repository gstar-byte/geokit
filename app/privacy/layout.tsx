import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — GEOKit",
  description:
    "GEOKit's privacy policy: all tools run 100% client-side in your browser. No accounts, no data storage, and analytics tracking stays off until you consent.",
  alternates: {
    canonical: "https://geokit.site/privacy",
  },
  openGraph: {
    title: "Privacy Policy — GEOKit",
    description:
      "GEOKit's privacy policy: all tools run 100% client-side in your browser. No accounts, no data storage, and analytics tracking stays off until you consent.",
    type: "website",
    url: "https://geokit.site/privacy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy — GEOKit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — GEOKit",
    description:
      "GEOKit's privacy policy: all tools run 100% client-side in your browser. No accounts, no data storage, and analytics tracking stays off until you consent.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy — GEOKit",
  "url": "https://geokit.site/privacy",
  "description":
    "GEOKit's privacy policy: all tools run 100% client-side in your browser. No accounts, no data storage, and analytics tracking stays off until you consent.",
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
      "name": "Privacy Policy",
      "item": "https://geokit.site/privacy"
    }
  ]
};

export default function PrivacyLayout({
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
