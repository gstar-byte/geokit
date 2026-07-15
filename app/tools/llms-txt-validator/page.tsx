"use client";

import { useState } from "react";

interface ValidationIssue {
  severity: "error" | "warning" | "info" | "pass";
  message: string;
  line?: number;
}

function validateLlmsTxt(content: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const lines = content.split("\n");

  if (!content.trim()) {
    return [{ severity: "error", message: "Content is empty." }];
  }

  // Check H1 title
  const hasH1 = /^#\s+.+/m.test(content);
  if (!hasH1) {
    issues.push({
      severity: "error",
      message: "Missing H1 title. The file must start with a # heading (e.g., # Site Name).",
    });
  } else {
    issues.push({ severity: "pass", message: "H1 title found." });
  }

  // Check H1 is first non-empty line
  const firstNonEmpty = lines.find((l) => l.trim());
  if (firstNonEmpty && !firstNonEmpty.startsWith("# ")) {
    issues.push({
      severity: "warning",
      message: "H1 title should be the first line of the file.",
    });
  }

  // Check for summary (blockquote after H1)
  const hasSummary = /^>\s+.+/m.test(content);
  if (hasSummary) {
    issues.push({ severity: "pass", message: "Summary blockquote found." });
  } else {
    issues.push({
      severity: "info",
      message: "No summary blockquote found. Consider adding a > summary line after the H1.",
    });
  }

  // Check for sections (H2)
  const h2Count = (content.match(/^##\s+.+/gm) || []).length;
  if (h2Count > 0) {
    issues.push({ severity: "pass", message: `${h2Count} section(s) (H2) found.` });
  } else {
    issues.push({
      severity: "info",
      message: "No H2 sections found. Consider organizing links into sections with ## headings.",
    });
  }

  // Check for markdown links
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = content.match(linkPattern);
  if (links && links.length > 0) {
    issues.push({ severity: "pass", message: `${links.length} markdown link(s) found.` });

    // Validate link URLs
    let invalidUrls = 0;
    links.forEach((link) => {
      const urlMatch = link.match(/\]\(([^)]+)\)/);
      if (urlMatch) {
      const url = urlMatch[1].trim();
        if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
          invalidUrls++;
        }
      }
    });
    if (invalidUrls > 0) {
      issues.push({
        severity: "warning",
        message: `${invalidUrls} link(s) have non-standard URLs. Use absolute URLs (https://) or absolute paths (/page).`,
      });
    }
  } else {
    issues.push({
      severity: "warning",
      message: "No markdown links found. llms.txt should contain links to your important pages.",
    });
  }

  // Check file size
  const sizeBytes = new Blob([content]).size;
  if (sizeBytes > 50000) {
    issues.push({
      severity: "warning",
      message: `File is ${Math.round(sizeBytes / 1024)}KB. Consider keeping it under 50KB for optimal AI processing.`,
    });
  } else {
    issues.push({ severity: "pass", message: `File size is ${sizeBytes} bytes — well within limits.` });
  }

  // Check for optional sections
  const hasOptional = /^##\s+Optional/i.test(content) || /^##\s+Links/i.test(content);
  if (hasOptional) {
    issues.push({ severity: "pass", message: "Optional/Links section found." });
  }

  // Check for code blocks (should not have any)
  if (/```/.test(content)) {
    issues.push({
      severity: "warning",
      message: "Code blocks found. llms.txt should be plain markdown without code blocks.",
    });
  }

  // Check for HTML tags
  if (/<[a-z][^>]*>/i.test(content)) {
    issues.push({
      severity: "warning",
      message: "HTML tags found. llms.txt should be pure markdown, no HTML.",
    });
  }

  return issues;
}

const severityConfig = {
  error: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: "✗" },
  warning: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "⚠" },
  info: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "ℹ" },
  pass: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", icon: "✓" },
};

export default function LlmsTxtValidatorPage() {
  const [content, setContent] = useState("");
  const [validated, setValidated] = useState(false);

  const issues = validated ? validateLlmsTxt(content) : [];
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const passes = issues.filter((i) => i.severity === "pass").length;

  const overallStatus = errors > 0 ? "fail" : warnings > 0 ? "warn" : "pass";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">llms.txt Validator</h1>
        <p className="text-gray-400">
          Paste your llms.txt content to check if it follows the spec — H1 title, valid markdown, link format, and more.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            llms.txt Content
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setValidated(false);
            }}
            placeholder={"# Your Site Name\n\n> A brief description of your site.\n\n## Docs\n\n- [Getting Started](https://yoursite.com/docs)\n- [API Reference](https://yoursite.com/api)"}
            rows={12}
            className="input-field font-mono text-sm"
          />
        </div>

        <button
          onClick={() => setValidated(true)}
          disabled={!content.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Validate
        </button>

        {validated && (
          <div className="space-y-4">
            {/* Summary */}
            <div className={`rounded-xl border p-6 text-center ${
              overallStatus === "pass"
                ? "border-green-500/30 bg-green-500/10"
                : overallStatus === "warn"
                ? "border-yellow-500/30 bg-yellow-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}>
              <div className={`text-2xl font-bold mb-2 ${
                overallStatus === "pass" ? "text-green-400" : overallStatus === "warn" ? "text-yellow-400" : "text-red-400"
              }`}>
                {overallStatus === "pass" ? "✓ Valid" : overallStatus === "warn" ? "⚠ Needs Improvement" : "✗ Invalid"}
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span className="text-green-400">{passes} passed</span>
                <span className="text-yellow-400">{warnings} warnings</span>
                <span className="text-red-400">{errors} errors</span>
              </div>
            </div>

            {/* Issues */}
            <div className="space-y-3">
              {issues.map((issue, i) => {
                const cfg = severityConfig[issue.severity];
                return (
                  <div
                    key={i}
                    className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4 flex items-start gap-3`}
                  >
                    <span className={`text-lg ${cfg.color} flex-shrink-0`}>
                      {cfg.icon}
                    </span>
                    <p className="text-sm text-gray-300 flex-1">{issue.message}</p>
                  </div>
                );
              })}
            </div>

            {errors > 0 && (
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <p className="text-sm text-gray-400 mb-2">
                  Need to create a valid llms.txt? Use our generator:
                </p>
                <a href="/tools/llms-txt-generator" className="text-brand-400 hover:underline text-sm">
                  → llms.txt Generator
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
