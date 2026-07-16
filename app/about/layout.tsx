import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GEOKit — Generative Engine Optimization Toolkit",
  description: "Learn why we built GEOKit and how Generative Engine Optimization (GEO) helps websites get cited and recommended by AI search engines like ChatGPT, Gemini, and Perplexity.",
  openGraph: {
    title: "About GEOKit — Generative Engine Optimization Toolkit",
    description: "Learn why we built GEOKit and how Generative Engine Optimization (GEO) helps websites get cited and recommended by AI search engines like ChatGPT, Gemini, and Perplexity.",
    type: "website",
    url: "https://geokit.site/about",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About GEOKit",
  "url": "https://geokit.site/about",
  "description": "Learn why we built GEOKit and how Generative Engine Optimization (GEO) helps websites get cited and recommended by AI search engines."
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
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
