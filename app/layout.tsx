import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GEOKit — Free GEO Tools for AI Search Optimization",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  description:
    "Free GEO toolkit to optimize your site for AI search: llms.txt generator, schema markup, robots.txt, readiness checker & more. No signup.",
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
    title: "GEOKit — Free GEO Tools for AI Search Optimization",
    description:
      "Free tools to optimize your website for ChatGPT, Perplexity, and Google AI Overviews. No signup.",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-76D0P54CSL"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-76D0P54CSL');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
