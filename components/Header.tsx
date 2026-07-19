"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header
      className="border-b sticky top-0 z-50 backdrop-blur-sm"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--surface) 80%, transparent)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            GEO<span className="text-brand-500">Kit</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          {/* Tools dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-sm md:text-base font-medium transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={() =>
                window.innerWidth > 768 && setMenuOpen(true)
              }
            >
              Tools ▾
            </button>
            <div
              className={`absolute right-0 top-full mt-2 w-56 rounded-lg border p-2 transition-all ${
                menuOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-1"
              }`}
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.05)",
              }}
              onMouseLeave={() =>
                window.innerWidth > 768 && setMenuOpen(false)
              }
            >
              {tools.map((tItem) => (
                <Link
                  key={tItem.href}
                  href={tItem.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--surface-alt)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {tItem.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/badge"
            className="text-sm md:text-base font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Badge
          </Link>
          <Link
            href="/about"
            className="text-sm md:text-base font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            About
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="ml-1 rounded-lg border px-2.5 py-1.5 text-sm transition-colors"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--text-secondary)",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
