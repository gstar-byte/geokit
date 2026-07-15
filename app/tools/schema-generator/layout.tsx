import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schema for AI Generator — JSON-LD Structured Data | GEOKit",
  description:
    "Generate AI-friendly JSON-LD structured data. Supports Article, Product, FAQ, Organization, HowTo & more. Free, no signup.",
  keywords: [
    "schema generator",
    "JSON-LD generator",
    "AI schema markup",
    "FAQPage schema",
    "structured data for AI",
    "schema.org generator",
  ],
  openGraph: {
    title: "Schema for AI Generator — JSON-LD Structured Data | GEOKit",
    description:
      "Generate AI-friendly JSON-LD structured data. Free, supports FAQ, Article, Product, and more.",
    type: "website",
  },
  alternates: {
    canonical: "/tools/schema-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
