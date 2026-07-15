"use client";

import { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  toolLink?: string;
  toolLabel?: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: "llms-txt",
    category: "AI Content Discovery",
    title: "Create and deploy llms.txt",
    desc: "Add an llms.txt file at your site root to help AI models understand what your site is about and which pages matter most.",
    toolLink: "/tools/llms-txt-generator",
    toolLabel: "Generate llms.txt",
  },
  {
    id: "robots-ai",
    category: "AI Content Discovery",
    title: "Configure AI crawler access in robots.txt",
    desc: "Decide which AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can access your site. Don't accidentally block them.",
    toolLink: "/tools/ai-robots-txt-generator",
    toolLabel: "Create AI robots.txt",
  },
  {
    id: "schema",
    category: "Structured Data",
    title: "Add JSON-LD structured data",
    desc: "Add schema markup to your pages so AI search engines can understand your content type, author, and key information.",
    toolLink: "/tools/schema-generator",
    toolLabel: "Generate Schema",
  },
  {
    id: "faq-schema",
    category: "Structured Data",
    title: "Add FAQPage schema for Q&A content",
    desc: "FAQPage schema makes your content 3.2x more likely to be cited in Google AI Overviews.",
    toolLink: "/tools/schema-generator",
    toolLabel: "Generate FAQ Schema",
  },
  {
    id: "title",
    category: "On-Page SEO",
    title: "Ensure every page has a unique title tag",
    desc: "Title tags help AI models understand what each page is about. Keep titles under 60 characters.",
  },
  {
    id: "meta-desc",
    category: "On-Page SEO",
    title: "Add meta descriptions to all pages",
    desc: "Meta descriptions provide context that AI models use to summarize your content in answers.",
  },
  {
    id: "headings",
    category: "On-Page SEO",
    title: "Use proper heading hierarchy (one H1, then H2/H3)",
    desc: "Clear heading structure helps AI models parse your content and identify key sections.",
  },
  {
    id: "semantic-html",
    category: "On-Page SEO",
    title: "Use semantic HTML elements",
    desc: "Use <article>, <main>, <section>, <nav> instead of generic <div> for better AI comprehension.",
  },
  {
    id: "og-tags",
    category: "On-Page SEO",
    title: "Add Open Graph tags",
    desc: "OG tags help AI models extract titles, descriptions, and images when citing your content.",
  },
  {
    id: "https",
    category: "Technical",
    title: "Serve your site over HTTPS",
    desc: "HTTPS is a basic requirement. AI crawlers may skip non-secure sites.",
  },
  {
    id: "sitemap",
    category: "Technical",
    title: "Submit an XML sitemap",
    desc: "A sitemap helps all search engines, including AI crawlers, discover your pages efficiently.",
  },
  {
    id: "fast-load",
    category: "Technical",
    title: "Ensure fast page load times",
    desc: "AI crawlers have timeout limits. If your site is slow, they may skip your content.",
  },
  {
    id: "citations",
    category: "Content Quality",
    title: "Include citations and sources in content",
    desc: "Content with citations and data sources is more likely to be cited by AI models as a reference.",
  },
  {
    id: "qa-format",
    category: "Content Quality",
    title: "Format key content as Q&A",
    desc: "AI models naturally look for question-answer patterns. Format important info as questions and answers.",
  },
  {
    id: "fresh-content",
    category: "Content Quality",
    title: "Keep content fresh and updated",
    desc: "AI models prefer recent, up-to-date content. Update key pages regularly.",
  },
  {
    id: "readiness-check",
    category: "Monitoring",
    title: "Run an AI readiness check",
    desc: "Use our AI Readiness Checker to get a score and identify gaps in your GEO setup.",
    toolLink: "/tools/ai-readiness-checker",
    toolLabel: "Check Now",
  },
];

const categories = [...new Set(checklistItems.map((item) => item.category))];

export default function GeoChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("geo-checklist");
    if (saved) {
      setChecked(JSON.parse(saved));
    }
  }, []);

  const toggle = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    localStorage.setItem("geo-checklist", JSON.stringify(updated));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">GEO Checklist</h1>
        <p className="text-gray-400">
          A step-by-step checklist to optimize your site for AI search engines. Track your progress across all GEO tasks. Your progress is saved locally.
        </p>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">Progress</span>
          <span className="text-sm text-gray-400">
            {completedCount} / {totalCount} completed
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={`text-center mt-3 text-lg font-bold ${
          progress === 100 ? "text-green-400" : progress >= 50 ? "text-yellow-400" : "text-gray-400"
        }`}>
          {progress === 100
            ? "🎉 All done! Your site is GEO-optimized."
            : progress >= 50
            ? `${progress}% — Good progress!`
            : `${progress}% — Just getting started`}
        </div>
      </div>

      {/* Checklist by category */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-brand-400 mb-4">
              {category}
            </h2>
            <div className="space-y-3">
              {checklistItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                      checked[item.id]
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                    }`}
                  >
                    <button
                      onClick={() => toggle(item.id)}
                      className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        checked[item.id]
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      {checked[item.id] && "✓"}
                    </button>
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium mb-1 ${
                        checked[item.id] ? "text-gray-500 line-through" : "text-white"
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">{item.desc}</p>
                      {item.toolLink && (
                        <a
                          href={item.toolLink}
                          className="inline-block text-xs text-brand-400 hover:text-brand-300 hover:underline"
                        >
                          → {item.toolLabel}
                        </a>
                      )}
                    </div>
                  </label>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
