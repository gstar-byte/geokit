export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 border-b border-gray-800 pb-8">
        <h1 className="text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-base text-gray-400">Last updated: July 17, 2026</p>
      </div>

      <div className="space-y-8 text-base text-gray-400 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to GEOKit (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate the website at{" "}
            <a href="https://geokit.site" className="text-brand-400 hover:underline">
              https://geokit.site
            </a>{" "}
            (the &quot;Service&quot;). We respect your privacy and are committed to protecting any information processed through our free Generative Engine Optimization (GEO) utility dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">2. Data We Process</h2>
          <p>
            GEOKit is designed as a client-first, privacy-respecting toolset. Most of our tools run entirely in your local browser window. 
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Website Audit inputs:</strong> When you run the AI Crawler Tester or AI Search Grader, we receive the URL or brand details you submit to perform diagnostic fetch requests and run AI models.
            </li>
            <li>
              <strong>API usage data:</strong> Submitted URLs are proxied dynamically to verify sitemap structures, fetch raw tags, or query AI models (such as Google Gemini). No inputs are permanently stored or sold.
            </li>
            <li>
              <strong>Cookies &amp; Analytics:</strong> We use Google Analytics (G-76D0P54CSL) to analyze basic visitor traffic trends. By default, analytics tracking is denied until you consent via our cookies prompt.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">3. Third-Party Integrations</h2>
          <p>
            We query public AI endpoints and server segment routers (like Cloudflare Edge Workers and Gemini AI models) to compute optimization benchmarks. These third parties receive query details solely to generate diagnostic responses and operate under their respective privacy protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">4. Data Retention</h2>
          <p>
            We do not maintain active databases containing user names, accounts, or submitted data logs. All diagnostic reports are compiled dynamically and vanish once you close your browser tab, except for client-side configuration parameters saved locally in your browser&apos;s <code>localStorage</code> (such as your GEO Checklist progress).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">5. Security of Data</h2>
          <p>
            The security of your inputs is important to us. All request traffic is encrypted in transit using industry-standard TLS (HTTPS) protocols to protect data transfers between your browser and our edge servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date at the top.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-gray-800">
          <h2 className="text-xl font-bold text-white">Contact Us</h2>
          <p>
            If you have any questions or feedback regarding this Privacy Policy, please reach out to us at{" "}
            <code className="text-brand-400">privacy@geokit.site</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
