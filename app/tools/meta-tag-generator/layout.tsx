import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tag Generator — OG & AI Citations",
  description: "Generate Open Graph tags and custom AI-friendly meta tags to maximize citations and clear brand signals.",
  openGraph: {
    title: "Meta Tag Generator — OG & AI Citations",
    description: "Generate Open Graph tags and custom AI-friendly meta tags to maximize citations and clear brand signals.",
    type: "website",
    url: "https://geokit.site/tools/meta-tag-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Meta Tag Generator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/meta-tag-generator",
  "description": "Generate Open Graph tags and custom AI-friendly meta tags to maximize citations and clear brand signals."
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
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
