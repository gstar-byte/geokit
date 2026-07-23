"use client";

import Link from "next/link";
import { useLanguage } from "@/components/i18n";

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
  name: "GEOKit",
  url: "https://geokit.site",
  description: "Free toolkit for Generative Engine Optimization (GEO). 14 free tools to optimize websites for AI search engines.",
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
  {
    href: "/tools/geo-score",
    title: "GEO Score",
    desc: "Paste your content and get an instant 0–100 score measuring how likely AI search engines are to cite it.",
    icon: "📈",
    tag: "New",
  },
  {
    href: "/tools/schema-validator",
    title: "Schema Validator & Preview",
    desc: "Validate your JSON-LD structured data and preview how it appears in Google Rich Results.",
    icon: "🔎",
    tag: "New",
  },
  {
    href: "/tools/sitemap-validator",
    title: "Sitemap Validator & Checker",
    desc: "Enter your sitemap URL to check XML syntax compliance, sitemaps.org format, file weight, and run instant HTTP status checks for page URLs to find broken links.",
    icon: "🗺️",
    tag: "New",
  },
];

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
  const { t } = useLanguage();

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
          <div className="inline-flex items-center rounded-full border border-brand-200 bg-white/80 dark:bg-gray-900/60 dark:border-brand-700/50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 shadow-xs backdrop-blur-sm mb-6 animate-fade-in">
            {t("Free · No Signup · No Data Collected", "Free · No Signup · No Data Collected")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t("Free GEO Tools for ", "Free GEO Tools for ")}
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              {t("AI Search", "AI Search")}
            </span>{" "}
            {t("Optimization", "Optimization")}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400 mb-8">
            {t(
              "Free GEO toolkit to optimize your site for AI search: llms.txt generator, schema markup, robots.txt, readiness checker & more. No signup.",
              "Optimize your website for ChatGPT, Perplexity, Google AI Overviews, and other AI search engines. Generate llms.txt, AI robots.txt, AI-friendly schema markup, and check your AI readiness score — all in one place."
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tools/ai-readiness-checker" className="btn-primary">
              {t("Check Your AI Readiness →", "Check Your AI Readiness →")}
            </Link>
            <Link href="/tools/llms-txt-generator" className="btn-secondary">
              {t("Generate llms.txt", "Generate llms.txt")}
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("All Tools", "All Tools")}</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
          {t(
            "Fourteen free tools to make your website visible to AI search engines.",
            "Fourteen free tools to make your website visible to AI search engines."
          )}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="tool-card group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{tool.icon}</span>
                {tool.tag && (
                  <span className="rounded-full border border-brand-200/80 bg-brand-50/80 dark:bg-brand-900/40 dark:border-brand-800 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                    {t(tool.tag, tool.tag)}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-400 transition-colors">
                {t(tool.title, tool.title)}
              </h3>
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                {t(tool.desc, tool.desc)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("100% Private", "100% Private")}
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {t(
                "All tools run in your browser. Your data never leaves your device. No servers, no tracking, no logs.",
                "All tools run in your browser. Your data never leaves your device. No servers, no tracking, no logs."
              )}
            </p>
          </div>
          <div>
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("Instant Results", "Instant Results")}
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {t(
                "No signup, no waiting. Open a tool and start using it immediately. Everything is processed locally.",
                "No signup, no waiting. Open a tool and start using it immediately. Everything is processed locally."
              )}
            </p>
          </div>
          <div>
            <div className="text-2xl mb-3">🆓</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("Free Forever", "Free Forever")}
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {t(
                "All tools are completely free with no limits. No premium plans, no credits, no hidden fees.",
                "All tools are completely free with no limits. No premium plans, no credits, no hidden fees."
              )}
            </p>
          </div>
          <div>
            <div className="text-2xl mb-3">📶</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("PWA & Offline Ready", "PWA & Offline Ready")}
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {t(
                "Install GEOKit on your desktop or mobile device. Core utility tools run fully offline without any network access.",
                "Install GEOKit on your desktop or mobile device. Core utility tools run fully offline without any network access."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t("Frequently Asked Questions", "Frequently Asked Questions")}
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-2">
              {t("What is GEO (Generative Engine Optimization)?", "What is GEO (Generative Engine Optimization)?")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              {t(
                "GEO is the practice of optimizing your website so that AI search engines like ChatGPT, Perplexity, and Google AI Overviews can understand, cite, and recommend your content. It includes technical signals like llms.txt, AI crawler access, and structured data.",
                "GEO is the practice of optimizing your website so that AI search engines like ChatGPT, Perplexity, and Google AI Overviews can understand, cite, and recommend your content. It includes technical signals like llms.txt, AI crawler access, and structured data."
              )}
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-2">
              {t("What is llms.txt?", "What is llms.txt?")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              {t(
                "llms.txt is a markdown file placed at the root of your website (e.g., example.com/llms.txt) that provides LLM-friendly content. It tells AI models what your site is about and which pages are most important, similar to how robots.txt guides search engine crawlers.",
                "llms.txt is a markdown file placed at the root of your website (e.g., example.com/llms.txt) that provides LLM-friendly content. It tells AI models what your site is about and which pages are most important, similar to how robots.txt guides search engine crawlers."
              )}
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-2">
              {t("Do I need to sign up or pay?", "Do I need to sign up or pay?")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              {t(
                "No. All GEOKit tools are 100% free with no signup required. Just open a tool and start using it. Everything runs in your browser.",
                "No. All GEOKit tools are 100% free with no signup required. Just open a tool and start using it. Everything runs in your browser."
              )}
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-2">
              {t("Are these tools safe to use?", "Are these tools safe to use?")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              {t(
                "Yes. All processing happens client-side in your browser. Your inputs and outputs are never sent to any server. You can verify this by checking your browser's network tab.",
                "Yes. All processing happens client-side in your browser. Your inputs and outputs are never sent to any server. You can verify this by checking your browser's network tab."
              )}
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-2">
              {t("Can I use GEOKit tools offline?", "Can I use GEOKit tools offline?")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              {t(
                "Yes! GEOKit is built as a Progressive Web App (PWA). You can install it on your device and use all core utility tools (like generators, validators, lists, and copy formatters) completely offline. Only diagnostic crawler tools require a network connection.",
                "Yes! GEOKit is built as a Progressive Web App (PWA). You can install it on your device and use all core utility tools (like generators, validators, lists, and copy formatters) completely offline. Only diagnostic crawler tools require a network connection."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Featured On Badges */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6">
          {t("Featured On", "Featured On")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="https://smollaunch.com"
            target="_blank"
            rel="noopener"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://smollaunch.com/badges/featured.svg"
              alt="GEOKit — Featured on Smol Launch"
              loading="lazy"
              width={250}
              height={60}
            />
          </a>
        </div>
      </section>
    </>
  );
}
