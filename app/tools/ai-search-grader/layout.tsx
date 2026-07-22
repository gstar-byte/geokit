import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Search Grader — Check Your Brand Visibility in LLM Answers",
  description: "Benchmark brand visibility, ranking, and share of voice across ChatGPT, Perplexity, Claude, Gemini, and DeepSeek.",
  keywords: ["AI search grader", "brand visibility in ChatGPT", "LLM share of voice", "Perplexity ranking audit"],
  alternates: {
    canonical: "https://geokit.site/tools/ai-search-grader",
  },
  openGraph: {
    title: "AI Search Grader — Check Your Brand Visibility in LLM Answers",
    description: "Benchmark brand visibility, ranking, and share of voice across ChatGPT, Perplexity, Claude, Gemini, and DeepSeek.",
    type: "website",
    url: "https://geokit.site/tools/ai-search-grader",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Search Grader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Search Grader — Check Your Brand Visibility in LLM Answers",
    description: "Benchmark brand visibility, ranking, and share of voice across ChatGPT, Perplexity, Claude, Gemini, and DeepSeek.",
    images: ["/og-image.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://geokit.site/tools/ai-search-grader/#webapp",
      "name": "AI Search Grader",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "url": "https://geokit.site/tools/ai-search-grader",
      "description": "Benchmark brand visibility and share of voice across 6 major AI search models.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://geokit.site/#organization",
        "name": "GEOKit",
        "url": "https://geokit.site",
        "logo": "https://geokit.site/icon-512.png"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://geokit.site/tools/ai-search-grader/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://geokit.site"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tools",
          "item": "https://geokit.site/#tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "AI Search Grader",
          "item": "https://geokit.site/tools/ai-search-grader"
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://geokit.site/tools/ai-search-grader/#howto",
      "name": "How to Measure Brand Visibility in AI Search",
      "description": "Step-by-step guide to grading your brand visibility across ChatGPT, Claude, and Perplexity.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Enter Brand Name and Niche Keywords",
          "text": "Provide your brand name and key target prompts."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Run Multi-Model Grader",
          "text": "Query LLMs in real-time to check if your site is recommended."
        }
      ]
    }
  ]
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      {children}
    </>
  );
}

