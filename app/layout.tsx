import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GEOKit — 10 Free GEO Tools for AI Search Optimization",
  description:
    "Free toolkit for Generative Engine Optimization. 10 tools: llms.txt generator, AI robots.txt, schema markup, AI readiness checker, sitemap generator, meta tag generator, Q&A formatter, AI crawler tester, and more. No signup required.",
  keywords: [
    "GEO",
    "Generative Engine Optimization",
    "AI SEO",
    "llms.txt",
    "AI search readiness",
    "schema markup",
    "robots.txt AI",
    "GEO tools",
    "AI optimization tools",
    "free SEO tools",
  ],
  openGraph: {
    title: "GEOKit — 10 Free GEO Tools for AI Search Optimization",
    description:
      "10 free tools to optimize your website for ChatGPT, Perplexity, and Google AI Overviews. No signup.",
    type: "website",
    siteName: "GEOKit",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
