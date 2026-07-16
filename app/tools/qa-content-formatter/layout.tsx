import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Q&A Content Formatter — AI Citation Optimizer",
  description: "Transform your web content into structured Q&A format, making it easier for LLMs to retrieve and cite as direct answers.",
  openGraph: {
    title: "Q&A Content Formatter — AI Citation Optimizer",
    description: "Transform your web content into structured Q&A format, making it easier for LLMs to retrieve and cite as direct answers.",
    type: "website",
    url: "https://geokit.site/tools/qa-content-formatter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Q&A Content Formatter",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/qa-content-formatter",
  "description": "Transform your web content into structured Q&A format, making it easier for LLMs to retrieve and cite as direct answers."
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
