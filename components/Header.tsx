import Link from "next/link";

const tools = [
  { href: "/tools/llms-txt-generator", label: "llms.txt Generator" },
  { href: "/tools/ai-robots-txt-generator", label: "AI Robots.txt" },
  { href: "/tools/schema-generator", label: "Schema for AI" },
  { href: "/tools/ai-readiness-checker", label: "AI Readiness Checker" },
  { href: "/tools/llms-txt-validator", label: "llms.txt Validator" },
  { href: "/tools/geo-checklist", label: "GEO Checklist" },
  { href: "/tools/ai-sitemap-generator", label: "AI Sitemap Generator" },
  { href: "/tools/meta-tag-generator", label: "Meta Tag Generator" },
  { href: "/tools/qa-content-formatter", label: "Q&A Content Formatter" },
  { href: "/tools/ai-crawler-tester", label: "AI Crawler Tester" },
  { href: "/tools/ai-search-grader", label: "AI Search Grader" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">
            GEO<span className="text-brand-500">Kit</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <button className="text-gray-300 hover:text-white text-base font-medium">
              Tools ▾
            </button>
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-800 bg-gray-900 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {tools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="block rounded-md px-3 py-2 text-base text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/badge"
            className="text-gray-300 hover:text-white text-base font-medium"
          >
            Badge
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white text-base font-medium"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
