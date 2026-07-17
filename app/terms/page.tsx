export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 border-b border-gray-800 pb-8">
        <h1 className="text-4xl font-extrabold text-white mb-4">Terms of Service</h1>
        <p className="text-base text-gray-400">Last updated: July 17, 2026</p>
      </div>

      <div className="space-y-8 text-base text-gray-400 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or using GEOKit (&quot;Service&quot;), hosted at{" "}
            <a href="https://geokit.site" className="text-brand-400 hover:underline">
              https://geokit.site
            </a>
            , you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">2. Permitted Use &amp; License</h2>
          <p>
            We grant you a personal, non-exclusive, non-transferable, revocable license to access and use our free optimization tools for personal or commercial analysis of websites you own or have explicit authorization to audit.
          </p>
          <p className="font-semibold text-gray-300">Under this license, you may not:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Attempt to bypass site request rate limits or dynamically scrape our internal API endpoints.</li>
            <li>Use our Service to conduct denial-of-service (DoS) attacks or automated bulk requests.</li>
            <li>Submit URLs containing malicious scripts, viruses, or illegal materials.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">3. Disclaimer of Warranties</h2>
          <p className="italic text-yellow-400/90 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-4">
            GEOKit is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. 
            All diagnostic scores, grading benchmarks, crawling simulations, and sitemap/schema reports are generated for educational and optimization reference purposes only. We do not guarantee the accuracy of AI model outputs or assume liability for search engine ranking fluctuations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall GEOKit or its operators be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of your access to or inability to use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">5. Termination</h2>
          <p>
            We reserve the right, in our sole discretion, to terminate or restrict your access to the Service at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users or the operation of the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Any changes will be posted directly on this page with an updated revision date.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-gray-800">
          <h2 className="text-xl font-bold text-white">Contact Us</h2>
          <p>
            For any inquiries regarding these Terms of Service, please contact us at{" "}
            <code className="text-brand-400">terms@geokit.site</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
