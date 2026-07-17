"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  const updateConsentState = (granted: boolean) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
      });
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem("geokit-consent");
    if (consent === "granted") {
      updateConsentState(true);
    } else if (consent === "denied") {
      updateConsentState(false);
    } else {
      // 首次访问延迟1秒展示
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("geokit-consent", "granted");
    updateConsentState(true);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const status = analyticsConsent ? "granted" : "denied";
    localStorage.setItem("geokit-consent", status);
    updateConsentState(analyticsConsent);
    setIsVisible(false);
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] rounded-2xl border border-gray-800 bg-gray-900/95 p-6 shadow-2xl backdrop-blur-md animate-fade-in-up transition-all duration-300">
      {/* Top Header & Badge & Close */}
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Client-side Safe
        </div>
        <button
          onClick={closeBanner}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close privacy banner"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Title & Description */}
      <h3 className="text-lg font-bold text-white mb-2">
        Cookie &amp; Privacy Settings
      </h3>
      <p className="text-xs text-gray-300 leading-relaxed mb-4">
        We use local storage to optimize your experience. All GEO tools run 100% client-side in your browser; your data never leaves your device.
      </p>

      {/* Expandable Preferences Section */}
      {showCustomizer && (
        <div className="mb-4 rounded-xl border border-gray-800 bg-gray-950/60 p-3.5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Essential Local Storage</p>
              <p className="text-[11px] text-gray-400">Required for client-side processing &amp; app preferences.</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Always Active</span>
          </div>

          <div className="border-t border-gray-800 pt-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Analytics Cookies</p>
              <p className="text-[11px] text-gray-400">Anonymous Google Analytics to measure tool usage.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      )}

      {/* Footer Link & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-800/60">
        <Link
          href="/about"
          onClick={closeBanner}
          className="text-xs font-medium text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
        >
          Learn more about our policy
        </Link>

        <div className="flex items-center gap-2">
          {!showCustomizer ? (
            <>
              <button
                onClick={() => setShowCustomizer(true)}
                className="rounded-xl border border-gray-700 bg-gray-800/80 px-3.5 py-2 text-xs font-semibold text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Customize Preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 active:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Accept All
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSavePreferences}
                className="rounded-xl border border-gray-700 bg-gray-800/80 px-3.5 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={handleAcceptAll}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 active:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Accept All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
