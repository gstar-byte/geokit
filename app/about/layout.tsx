import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GEOKit — Free GEO Tools for AI Search Optimization",
  description:
    "Learn about GEOKit, a free toolkit for Generative Engine Optimization. Optimize your site for ChatGPT, Perplexity & Google AI Overviews. No signup, no tracking.",
  keywords: [
    "about GEOKit",
    "GEO tools",
    "free AI SEO tools",
    "generative engine optimization",
    "AI search optimization tools",
  ],
  openGraph: {
    title: "About GEOKit — Free GEO Tools for AI Search Optimization",
    description:
      "Free tools to optimize your website for AI search engines. No signup required.",
    type: "website",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
