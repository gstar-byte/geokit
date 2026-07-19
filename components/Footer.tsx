export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-base" style={{ color: "var(--text-muted)" }}>
            GEOKit — Free GEO Tools for AI Search Optimization
          </p>
          <div
            className="flex items-center gap-6 text-base"
            style={{ color: "var(--text-muted)" }}
          >
            <a
              href="mailto:support@geokit.site"
              className="hover:text-brand-400 transition-colors"
            >
              Contact
            </a>
            <span>·</span>
            <a
              href="/privacy"
              className="hover:text-brand-400 transition-colors"
            >
              Privacy Policy
            </a>
            <span>·</span>
            <a
              href="/terms"
              className="hover:text-brand-400 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
