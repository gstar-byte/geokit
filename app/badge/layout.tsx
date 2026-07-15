import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Readiness Badge — Show Your GEO Score | GEOKit",
  description:
    "Display your AI Readiness Score with a free embeddable badge. Shows visitors your site is optimized for AI search. Links back to GEOKit.",
  keywords: [
    "AI readiness badge",
    "GEO score badge",
    "AI SEO badge",
    "embeddable badge",
    "AI optimization score",
  ],
  openGraph: {
    title: "AI Readiness Badge — Show Your GEO Score | GEOKit",
    description:
      "Display your AI Readiness Score with an embeddable badge. Free.",
    type: "website",
  },
  alternates: {
    canonical: "/badge",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
