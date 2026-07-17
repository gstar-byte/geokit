"use client";

import Link from "next/link";
import { useLanguage } from "./i18n";

const tools = [
  { href: "/tools/llms-txt-generator", label: "llms.txt Generator" },
  { href: "/tools/ai-robots-txt-generator", label: "AI Robots.txt Generator" },
  { href: "/tools/schema-generator", label: "Schema for AI Generator" },
  { href: "/tools/ai-readiness-checker", label: "AI Readiness Checker" },
  { href: "/tools/llms-txt-validator", label: "llms.txt Validator" },
  { href: "/tools/geo-checklist", label: "GEO Checklist" },
  { href: "/tools/ai-sitemap-generator", label: "AI Sitemap Generator" },
  { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
  { href: "/tools/qa-content-formatter", label: "Q&A Content Formatter" },
  { href: "/tools/ai-crawler-tester", label: "AI Crawler Tester" },
  { href: "/tools/ai-search-grader", label: "AI Search Grader" },
  { href: "/tools/geo-score", label: "GEO Score" },
  { href: "/tools/schema-validator", label: "Schema Validator & Preview" },
  { href: "/tools/sitemap-validator", label: "Sitemap Validator & Checker" },
];

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            GEO<span className="text-brand-500">Kit</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <div className="relative group">
            <button className="text-gray-300 hover:text-white text-sm md:text-base font-medium">
              {t("Tools", "Tools")} ▾
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-800 bg-gray-900 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {tools.map((tItem) => (
                <Link
                  key={tItem.href}
                  href={tItem.href}
                  className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {t(tItem.label, tItem.label)}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/badge"
            className="text-gray-300 hover:text-white text-sm md:text-base font-medium"
          >
            {t("Badge", "Badge")}
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white text-sm md:text-base font-medium"
          >
            {t("About", "About")}
          </Link>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            className="ml-2 rounded-lg border border-gray-700 bg-gray-900 px-2.5 py-1 text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            {lang === "en" ? "🌐 中文" : "🌐 EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}
