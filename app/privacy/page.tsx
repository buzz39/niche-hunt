export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400">
            <span className="text-2xl">⚡</span> NicheHunt
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: February 11, 2026</p>

        <div className="space-y-8 text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              NicheHunt (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy and is committed to protecting 
              your personal data. This Privacy Policy explains how we collect, use, and protect your information 
              when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-slate-300 mb-2">Information you provide:</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Email address (when making a purchase or contacting us)</li>
              <li>Payment information (processed securely by our third-party payment provider — we do not store card details)</li>
              <li>Any information you voluntarily provide through support communications</li>
            </ul>
            <h3 className="text-lg font-medium text-slate-300 mb-2">Information collected automatically:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website</li>
              <li>IP address (anonymized where possible)</li>
              <li>Device type and operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your purchase and provide access to the database</li>
              <li>Send purchase confirmations and receipts</li>
              <li>Respond to support requests</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do <span className="text-white font-medium">not</span> sell, rent, or trade your personal 
              information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="text-white">Payment processor</span> — to securely handle transactions. They have their own privacy policies governing your payment data.</li>
              <li><span className="text-white">Hosting provider</span> — to serve our website. They may collect server logs including IP addresses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>
              We use minimal cookies necessary for the functioning of our website. These may include 
              session cookies for authentication and preference cookies. We do not use advertising or 
              tracking cookies. You can disable cookies in your browser settings, but this may affect 
              the functionality of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. All data 
              transmission is encrypted using HTTPS. Payment information is handled entirely by our 
              payment processor and never touches our servers. However, no method of electronic 
              transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to provide the Service 
              and fulfill the purposes described in this policy. Purchase records are retained for 
              accounting and legal compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our Service is not intended for children under the age of 13. We do not knowingly collect 
              personal information from children. If you believe a child has provided us with personal 
              information, please contact us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page 
              with an updated date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your data rights, contact us at:{" "}
              <span className="text-emerald-400">support@nichehunt.com</span>
            </p>
          </section>
        </div>

        <footer className="mt-16 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>© 2026 NicheHunt. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
