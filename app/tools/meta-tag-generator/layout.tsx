import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tag Generator — OG, Twitter & AI Meta Tags | GEOKit",
  description:
    "Generate Open Graph, Twitter Card, and AI-specific meta tags including citation_author, ai:summary, and article tags. Help AI search engines attribute and cite your content. Free online tool.",
  keywords: [
    "meta tag generator",
    "Open Graph generator",
    "Twitter Card generator",
    "AI meta tags",
    "citation meta tags",
    "OG tag generator",
  ],
  openGraph: {
    title: "Meta Tag Generator — OG, Twitter & AI Meta Tags | GEOKit",
    description:
      "Generate Open Graph, Twitter Card, and AI-specific meta tags. Free online tool.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/meta-tag-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
