"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools-config";
import { useLanguage } from "@/components/i18n";

export default function EmbedThisTool() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Find the current tool based on pathname
  const currentTool = tools.find((tool) => tool.href === pathname);

  if (!currentTool) {
    return null; // Do not render if not on a known tool page
  }

  const embedHtml = `<a href="https://geokit.site${currentTool.href}">${currentTool.title} - Free GEO Tools</a>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t("Share this tool", "Share this tool")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t(
            "Found this tool useful? Help others by linking to it from your blog or resources page.",
            "Found this tool useful? Help others by linking to it from your blog or resources page."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              readOnly
              value={embedHtml}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 font-mono focus:outline-none focus:border-brand-500 transition-colors"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <span>✓</span> {t("Copied!", "Copied!")}
              </>
            ) : (
              <>
                <span>📋</span> {t("Copy HTML", "Copy HTML")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
