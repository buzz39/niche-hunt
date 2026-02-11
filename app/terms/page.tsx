export default function Terms() {
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
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: February 11, 2026</p>

        <div className="space-y-8 text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using NicheHunt (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              NicheHunt provides a database of YouTube content niches analyzed using publicly available data 
              from the YouTube Data API v3 and Google Trends. The Service includes niche recommendations, 
              difficulty scores, estimated CPM ranges, monetization strategies, and trend data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Accuracy Disclaimer</h2>
            <p className="mb-3">
              The data provided by NicheHunt is for informational purposes only. While we strive for accuracy, 
              please note the following:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>CPM estimates are based on industry averages by advertising vertical and may not reflect your actual earnings.</li>
              <li>Actual CPMs vary based on audience location, video length, viewer demographics, season, and channel authority.</li>
              <li>Difficulty scores are calculated algorithmically and represent relative competition levels at the time of analysis.</li>
              <li>Market conditions change over time. Niches may become more or less competitive after our analysis date.</li>
              <li>We do not guarantee any specific income, views, subscribers, or results from using our data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Purchases and Payments</h2>
            <p className="mb-3">
              Access to the full NicheHunt database requires a one-time purchase. By making a purchase, you agree to the following:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are listed in US Dollars (USD).</li>
              <li>Payment is processed through our third-party payment provider.</li>
              <li>You will receive immediate access to the full database upon successful payment.</li>
              <li>Prices are subject to change without notice, but changes will not affect existing purchases.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Refund Policy</h2>
            <p>
              We offer a <span className="text-white font-medium">30-day money-back guarantee</span>. If you are unsatisfied 
              with the Service for any reason, contact us within 30 days of purchase for a full refund. 
              Refund requests should be sent to the email address provided at the bottom of this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h2>
            <p className="mb-3">
              The NicheHunt database, analysis methodology, and website content are proprietary. You may:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the data for your personal content creation and business decisions.</li>
              <li>Share insights from the data in your own content.</li>
            </ul>
            <p className="mt-3">You may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Redistribute, resell, or share your account access with others.</li>
              <li>Scrape, copy, or reproduce the database in whole or in part for redistribution.</li>
              <li>Create a competing product using our data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              NicheHunt is provided &quot;as is&quot; without warranties of any kind. We are not liable for any 
              direct, indirect, incidental, or consequential damages arising from your use of the Service. 
              Our total liability shall not exceed the amount you paid for the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Data Sources</h2>
            <p>
              Our data is sourced from the YouTube Data API v3 and Google Trends, both of which are publicly 
              available services provided by Google. We comply with YouTube API Services Terms of Service and 
              Google&apos;s Terms of Service. We do not collect or store any private YouTube channel data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page 
              with an updated date. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>
              For questions about these Terms, refund requests, or other inquiries, please contact us at:{" "}
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
