import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GEOKit — Generative Engine Optimization Toolkit",
  description:
    "Learn why we built GEOKit and how Generative Engine Optimization (GEO) helps websites get cited and recommended by AI search engines like ChatGPT, Gemini, and Perplexity.",
  alternates: {
    canonical: "https://geokit.site/about",
  },
  openGraph: {
    title: "About GEOKit — Generative Engine Optimization Toolkit",
    description:
      "Learn why we built GEOKit and how Generative Engine Optimization (GEO) helps websites get cited and recommended by AI search engines like ChatGPT, Gemini, and Perplexity.",
    type: "website",
    url: "https://geokit.site/about",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About GEOKit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About GEOKit — Generative Engine Optimization Toolkit",
    description:
      "Learn why we built GEOKit and how Generative Engine Optimization (GEO) helps websites get cited and recommended by AI search engines.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About GEOKit",
  "url": "https://geokit.site/about",
  "description":
    "Learn why we built GEOKit and how Generative Engine Optimization (GEO) helps websites get cited and recommended by AI search engines.",
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
      "name": "About",
      "item": "https://geokit.site/about"
    }
  ]
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
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
