import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import PWARegister from "@/components/PWARegister";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://geokit.site"),
  title: "GEOKit — Free GEO Tools for AI Search Optimization",
  manifest: "/manifest.json",
  authors: [{ name: "GEOKit Team" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "GEOKit — Free GEO Tools for AI Search Optimization",
    description:
      "Free tools to optimize your website for ChatGPT, Perplexity, and Google AI Overviews. No signup.",
    type: "website",
    siteName: "GEOKit",
    url: "https://geokit.site",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GEOKit — Free GEO Tools for AI Search Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GEOKit — Free GEO Tools for AI Search Optimization",
    description:
      "Free tools to optimize your website for ChatGPT, Perplexity, and Google AI Overviews. No signup.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://geokit.site",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOUC prevention: apply theme class before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('geokit-theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-76D0P54CSL"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
              });
              gtag('js', new Date());
              gtag('config', 'G-76D0P54CSL');
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
