'use client';

import React, { useState } from 'react';
import { niches } from './data/niches';

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handlePurchase = () => {
    // Simulation of payment process
    const confirm = window.confirm("Unlock full database for $19? (Simulation)");
    if (confirm) {
      setIsUnlocked(true);
      alert("Payment Successful! Database Unlocked.");
    }
  };

  const visibleNiches = isUnlocked ? niches : niches.slice(0, 5);
  const blurredRows = isUnlocked ? [] : Array(5).fill(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-400">
            <span className="text-2xl">⚡</span> NicheHunt
          </div>
          <button 
            onClick={handlePurchase}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              isUnlocked 
                ? "bg-slate-800 text-slate-400 cursor-default"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            }`}
          >
            {isUnlocked ? "Premium Member" : "Get Access - $19"}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-slate-400 mb-4">
            Updated for 2026 • 500+ Verified Niches
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Stop Guessing. <br className="hidden md:block" /> Start Creating.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            The ultimate database of high-CPM, low-competition content niches. 
            Curated manually to help you build profitable faceless channels.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={handlePurchase}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              Unlock Full Database
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="flex text-yellow-500">★★★★★</span>
              <span>Trusted by 1,200+ Creators</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: "Total Niches", value: "500+" },
            { label: "Avg. CPM", value: "$28" },
            { label: "Competition", value: "Low-Med" },
            { label: "Monetization", value: "Verified" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="relative rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/30 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium w-1/4">Niche Name</th>
                  <th className="p-4 font-medium w-1/6">Difficulty</th>
                  <th className="p-4 font-medium w-1/6">Est. CPM</th>
                  <th className="p-4 font-medium">Monetization Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {visibleNiches.map((niche) => (
                  <tr key={niche.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{niche.name}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        niche.difficulty === 'Low' 
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                          : niche.difficulty === 'Medium'
                          ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
                          : 'bg-red-900/30 text-red-400 border-red-800'
                      }`}>
                        {niche.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{niche.cpm}</td>
                    <td className="p-4 text-slate-400 text-sm">{niche.monetization}</td>
                  </tr>
                ))}

                {/* Blurred Rows Overlay */}
                {!isUnlocked && blurredRows.map((_, i) => (
                  <tr key={`blur-${i}`} className="filter blur-sm select-none opacity-50">
                    <td className="p-4 text-slate-300">Hidden Premium Niche #{i + 6}</td>
                    <td className="p-4"><span className="bg-slate-800 text-transparent rounded px-2">Low</span></td>
                    <td className="p-4 text-slate-300">$XX-$XX</td>
                    <td className="p-4 text-slate-400">Affiliate, Ads, Sponsorships</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paywall Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col items-center justify-end pb-12 z-10">
              <div className="text-center space-y-4">
                <p className="text-slate-300 text-lg font-medium">
                  Unlock 495+ more profitable niches tailored for 2026
                </p>
                <button 
                  onClick={handlePurchase}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Instant Access - $19
                </button>
                <p className="text-xs text-slate-500">30-day money-back guarantee • Secure payment</p>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="group p-6 rounded-xl bg-slate-900 border border-slate-800 open:bg-slate-800/50 transition-all">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-slate-200">
                How is this data sourced?
                <span className="transform group-open:rotate-180 transition-transform text-emerald-400">▼</span>
              </summary>
              <p className="mt-4 text-slate-400 leading-relaxed">
                We use custom Python scripts to analyze keyword volume, competition scores, and ad revenue data from YouTube API and Google Trends. Each niche is manually verified for viability.
              </p>
            </details>
            <details className="group p-6 rounded-xl bg-slate-900 border border-slate-800 open:bg-slate-800/50 transition-all">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-slate-200">
                Is this suitable for beginners?
                <span className="transform group-open:rotate-180 transition-transform text-emerald-400">▼</span>
              </summary>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Absolutely. We specifically tag niches with "Low" difficulty that require zero on-camera presence and minimal editing skills.
              </p>
            </details>
            <details className="group p-6 rounded-xl bg-slate-900 border border-slate-800 open:bg-slate-800/50 transition-all">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-slate-200">
                What format is the data in?
                <span className="transform group-open:rotate-180 transition-transform text-emerald-400">▼</span>
              </summary>
              <p className="mt-4 text-slate-400 leading-relaxed">
                You get immediate access to the sortable online database, plus a downloadable CSV and Notion template.
              </p>
            </details>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>© 2026 NicheHunt. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
