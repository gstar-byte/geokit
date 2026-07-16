import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Badge — GEOKit",
  description: "Get a free embeddable badge to display your website's AI readiness score. Build trust and signal your GEO readiness to web crawlers.",
  openGraph: {
    title: "AI Readiness Badge — GEOKit",
    description: "Get a free embeddable badge to display your website's AI readiness score. Build trust and signal your GEO readiness to web crawlers.",
    type: "website",
    url: "https://geokit.site/badge",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "AI Readiness Badge",
  "url": "https://geokit.site/badge",
  "description": "Showcase your website's AI readiness score with a free, custom embeddable badge."
};

export default function BadgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
