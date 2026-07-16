import Link from "next/link";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GEOKit",
  description: "Free GEO tools for AI search optimization",
  url: "https://geokit.site",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://geokit.site/tools/{search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GEOKit",
  url: "https://geokit.site",
  description: "Free toolkit for Generative Engine Optimization (GEO). 10 free tools to optimize websites for AI search engines.",
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
        text: "llms.txt is a markdown file placed at the root of your website (e.g., example.com/llms.txt) that provides LLM-friendly content. It tells AI models what your site is about and which pages are most important, similar to how robots.txt guides search engine crawlers.",
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
        text: "Yes. All processing happens client-side in your browser. Your inputs and outputs are never sent to any server. You can verify this by checking your browser's network tab.",
      },
    },
  ],
};

const tools = [
  {
    href: "/tools/llms-txt-generator",
    title: "llms.txt Generator",
    desc: "Create an llms.txt file that tells AI models what your site is about and which pages matter most.",
    icon: "📄",
    tag: "Most Popular",
  },
  {
    href: "/tools/ai-robots-txt-generator",
    title: "AI Robots.txt Generator",
    desc: "Control which AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can access your site with a production-ready robots.txt.",
    icon: "🤖",
  },
  {
    href: "/tools/schema-generator",
    title: "Schema for AI Generator",
    desc: "Generate AI-friendly JSON-LD structured data that helps ChatGPT, Perplexity, and Google AI Overviews understand your content.",
    icon: "🏷️",
  },
  {
    href: "/tools/ai-readiness-checker",
    title: "AI Readiness Checker",
    desc: "Enter your URL and get an instant 0–100 score showing how well AI search engines can read and cite your site.",
    icon: "📊",
    tag: "Free Check",
  },
  {
    href: "/tools/llms-txt-validator",
    title: "llms.txt Validator",
    desc: "Paste your llms.txt content to check if it follows the spec — H1 title, valid markdown, link format, and more.",
    icon: "✅",
  },
  {
    href: "/tools/geo-checklist",
    title: "GEO Checklist",
    desc: "A step-by-step checklist to optimize your site for AI search engines. Track your progress across all GEO tasks.",
    icon: "📋",
  },
  {
    href: "/tools/ai-sitemap-generator",
    title: "AI Sitemap Generator",
    desc: "Generate an XML sitemap optimized for AI crawlers with priority hints and update frequencies.",
    icon: "🗺️",
  },
  {
    href: "/tools/meta-tag-generator",
    title: "Meta Tag Generator",
    desc: "Generate Open Graph + AI-specific meta tags including citation, author, and content signals.",
    icon: "🏷️",
  },
  {
    href: "/tools/qa-content-formatter",
    title: "Q&A Content Formatter",
    desc: "Transform your content into Q&A format that AI models naturally parse and cite in answers.",
    icon: "💬",
  },
  {
    href: "/tools/ai-crawler-tester",
    title: "AI Crawler Tester",
    desc: "Simulate how AI crawlers see your page. Check what content GPTBot, ClaudeBot, and others can extract.",
    icon: "🔍",
  },
  {
    href: "/tools/ai-search-grader",
    title: "AI Search Grader",
    desc: "See how visible your brand is in AI search. We query 6 AI models with niche-relevant prompts and measure your brand's visibility and ranking.",
    icon: "🎯",
    tag: "New",
  },
];

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/20 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-300 mb-6">
            Free · No Signup · No Data Collected
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Free GEO Tools for{" "}
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              AI Search
            </span>{" "}
            Optimization
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-400 mb-8">
            Optimize your website for ChatGPT, Perplexity, Google AI Overviews,
            and other AI search engines. Generate llms.txt, AI robots.txt,
            AI-friendly schema markup, and check your AI readiness score — all
            in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tools/ai-readiness-checker" className="btn-primary">
              Check Your AI Readiness →
            </Link>
            <Link href="/tools/llms-txt-generator" className="btn-secondary">
              Generate llms.txt
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-2">All Tools</h2>
        <p className="text-lg text-gray-400 mb-8">
          Ten free tools to make your website visible to AI search engines.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="tool-card group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{tool.icon}</span>
                {tool.tag && (
                  <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-300">
                    {tool.tag}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-base text-gray-400 leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              100% Private
            </h3>
            <p className="text-base text-gray-400">
              All tools run in your browser. Your data never leaves your device.
              No servers, no tracking, no logs.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Instant Results
            </h3>
            <p className="text-base text-gray-400">
              No signup, no waiting. Open a tool and start using it immediately.
              Everything is processed locally.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-3">🆓</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Free Forever
            </h3>
            <p className="text-base text-gray-400">
              All tools are completely free with no limits. No premium plans,
              no credits, no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-2">
              What is GEO (Generative Engine Optimization)?
            </h3>
            <p className="text-gray-400 text-base">
              GEO is the practice of optimizing your website so that AI search
              engines like ChatGPT, Perplexity, and Google AI Overviews can
              understand, cite, and recommend your content. It includes
              technical signals like llms.txt, AI crawler access, and structured
              data.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">
              What is llms.txt?
            </h3>
            <p className="text-gray-400 text-base">
              llms.txt is a markdown file placed at the root of your website
              (e.g., example.com/llms.txt) that provides LLM-friendly content.
              It tells AI models what your site is about and which pages are
              most important, similar to how robots.txt guides search engine
              crawlers.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">
              Do I need to sign up or pay?
            </h3>
            <p className="text-gray-400 text-base">
              No. All GEOKit tools are 100% free with no signup required. Just
              open a tool and start using it. Everything runs in your browser.
            </p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">
              Are these tools safe to use?
            </h3>
            <p className="text-gray-400 text-base">
              Yes. All processing happens client-side in your browser. Your
              inputs and outputs are never sent to any server. You can verify
              this by checking your browser&apos;s network tab.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
