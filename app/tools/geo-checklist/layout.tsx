import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEO Checklist — Step-by-Step AI SEO Guide",
  description: "Follow a complete, structured checklist of technical and content optimization steps to prepare your site for generative search.",
  openGraph: {
    title: "GEO Checklist — Step-by-Step AI SEO Guide",
    description: "Follow a complete, structured checklist of technical and content optimization steps to prepare your site for generative search.",
    type: "website",
    url: "https://geokit.site/tools/geo-checklist",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GEO Checklist",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/geo-checklist",
  "description": "Follow a complete, structured checklist of technical and content optimization steps to prepare your site for generative search."
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
