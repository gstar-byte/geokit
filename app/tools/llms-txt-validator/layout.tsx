import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "llms.txt Validator — Check Markdown Syntax",
  description: "Validate your llms.txt file format, headings, structure, and links against the official specifications.",
  openGraph: {
    title: "llms.txt Validator — Check Markdown Syntax",
    description: "Validate your llms.txt file format, headings, structure, and links against the official specifications.",
    type: "website",
    url: "https://geokit.site/tools/llms-txt-validator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "llms.txt Validator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript",
  "url": "https://geokit.site/tools/llms-txt-validator",
  "description": "Validate your llms.txt file format, headings, structure, and links against the official specifications."
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
