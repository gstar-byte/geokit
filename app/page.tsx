import HomeContent from "./HomeContent";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GEOKit",
  description: "Free GEO tools for AI search optimization",
  url: "https://geokit.site",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://geokit.site/#organization",
  name: "GEOKit",
  url: "https://geokit.site",
  logo: "https://geokit.site/icon-512.png",
  description: "Free toolkit for Generative Engine Optimization (GEO). 14 free tools to optimize websites for AI search engines.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is GEO (Generative Engine Optimization)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GEO is the practice of optimizing your website so that AI search engines like ChatGPT, Perplexity, and Google AI Overviews can understand, cite, and recommend your content. It includes technical signals like llms.txt, AI crawler access, and structured data.",
      },
    },
    {
      "@type": "Question",
      name: "What is llms.txt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "llms.txt is a markdown file placed at the root of your website (e.g., example.com/llms.txt) that provides LLM-friendly content. It tells AI models what your site is about and which pages are most important.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to sign up or pay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All GEOKit tools are 100% free with no signup required. Just open a tool and start using it. Everything runs in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Are these tools safe to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All processing happens client-side in your browser. Your inputs and outputs are never sent to any server.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use GEOKit tools offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! GEOKit is built as a Progressive Web App (PWA). You can install it on your device and use all core utility tools (like generators, validators, lists, and copy formatters) completely offline.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeContent />
    </>
  );
}
