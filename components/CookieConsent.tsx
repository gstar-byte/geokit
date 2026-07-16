"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延迟少许展示，体验更好
    const consent = localStorage.getItem("geokit-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem("geokit-consent", "true");
    setIsVisible(false);
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-3rem)] rounded-2xl border border-gray-800 bg-gray-950/90 p-5 shadow-2xl backdrop-blur-md animate-fade-in-up transition-all duration-300">
      {/* 关闭按钮 */}
      <button
        onClick={closeBanner}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        aria-label="Close privacy banner"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex gap-4">
        {/* 图标 */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* 内容 */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">We Value Your Privacy</h3>
          <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
            GEOKit runs 100% locally in your browser. Your data never leaves your device. We use anonymous, cookies-free analytics solely to understand tool usage.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={acceptConsent}
              className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 active:bg-brand-700 transition-colors shadow-md shadow-brand-600/10"
            >
              Accept
            </button>
            <Link
              href="/about"
              onClick={closeBanner}
              className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
