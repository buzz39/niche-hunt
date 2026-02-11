'use client';

import React, { useState, useMemo } from 'react';
import { niches } from './data/niches';

const CATEGORIES = ['all', ...Array.from(new Set(niches.map(n => n.category)))];

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'cpm'>('name');

  const handlePurchase = () => {
    const confirm = window.confirm("Unlock full database for $9? (Simulation)");
    if (confirm) {
      setIsUnlocked(true);
      alert("Payment Successful! Database Unlocked.");
    }
  };

  const filteredNiches = useMemo(() => {
    const filtered = selectedCategory === 'all' 
      ? niches 
      : niches.filter(n => n.category === selectedCategory);
    
    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'difficulty') return a.difficultyScore - b.difficultyScore;
      return 0;
    });
  }, [selectedCategory, sortBy]);

  const visibleNiches = isUnlocked ? filteredNiches : filteredNiches.slice(0, 5);
  const blurredRows = isUnlocked ? [] : Array(5).fill(null);
  const totalNiches = niches.length;
  const lockedCount = filteredNiches.length - 5;

  const lowDiffCount = niches.filter(n => n.difficulty === 'Low').length;
  const categories = new Set(niches.map(n => n.category)).size;

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
            {isUnlocked ? "Premium Member" : "Get Access - $9"}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-slate-400 mb-4">
            Updated Feb 2026 • {totalNiches} Verified Niches (Growing Daily)
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Stop Guessing. <br className="hidden md:block" /> Start Creating.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            A data-driven database of high-CPM, low-competition content niches. 
            Analyzed using YouTube API data to help you build profitable faceless channels.
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
              <span>Data sourced from YouTube API</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: "Total Niches", value: `${totalNiches}+` },
            { label: "Categories", value: `${categories}` },
            { label: "Low Difficulty", value: `${lowDiffCount}` },
            { label: "Data Source", value: "YouTube API" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-slate-500 uppercase tracking-wider">Category:</span>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-slate-500 uppercase tracking-wider">Sort:</span>
          {[
            { key: 'name' as const, label: 'Name' },
            { key: 'difficulty' as const, label: 'Difficulty' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sortBy === s.key
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="relative rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/30 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Niche Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Difficulty</th>
                  <th className="p-4 font-medium">Est. CPM</th>
                  <th className="p-4 font-medium">Trend</th>
                  <th className="p-4 font-medium">Monetization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {visibleNiches.map((niche) => (
                  <tr key={niche.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{niche.name}</div>
                      {isUnlocked && (
                        <div className="text-xs text-slate-500 mt-1">
                          {niche.metrics.totalChannels} channels • {niche.metrics.avgSubscribers.toLocaleString()} avg subs • {niche.metrics.avgEngagementRate}% engagement
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {niche.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        niche.difficulty === 'Low' 
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                          : niche.difficulty === 'Medium'
                          ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
                          : 'bg-red-900/30 text-red-400 border-red-800'
                      }`}>
                        {niche.difficulty} ({niche.difficultyScore}/100)
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{niche.cpm}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        niche.trend.status === 'Rising'
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                          : niche.trend.status === 'Declining'
                          ? 'bg-red-900/30 text-red-400 border-red-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {niche.trend.status === 'Rising' ? '↑' : niche.trend.status === 'Declining' ? '↓' : '→'} {niche.trend.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{niche.monetization}</td>
                  </tr>
                ))}

                {/* Blurred Rows Overlay */}
                {!isUnlocked && blurredRows.map((_, i) => (
                  <tr key={`blur-${i}`} className="filter blur-sm select-none opacity-50">
                    <td className="p-4 text-slate-300">Hidden Premium Niche #{i + 6}</td>
                    <td className="p-4"><span className="bg-slate-800 text-transparent rounded px-2">cat</span></td>
                    <td className="p-4"><span className="bg-slate-800 text-transparent rounded px-2">Low</span></td>
                    <td className="p-4 text-slate-300">$XX-$XX</td>
                    <td className="p-4"><span className="bg-slate-800 text-transparent rounded px-2">Stable</span></td>
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
                  Unlock {lockedCount > 0 ? `${lockedCount}+` : ''} more profitable niches with full metrics
                </p>
                <button 
                  onClick={handlePurchase}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Instant Access - $9
                </button>
                <p className="text-xs text-slate-500">30-day money-back guarantee • Secure payment</p>
              </div>
            </div>
          )}
        </div>

        {/* Data Methodology */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-3">📊 How We Source Our Data</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every niche is analyzed using the <span className="text-emerald-400">YouTube Data API v3</span> and <span className="text-emerald-400">Google Trends</span>. 
            We scan 50+ channels and 30+ recent videos per niche, calculating real competition scores based on 
            subscriber counts, view distribution, engagement rates, and upload frequency. 
            CPM estimates are based on published industry reports by advertising vertical.
            Data is refreshed monthly. Last updated: <span className="text-white">{niches[0]?.lastUpdated ? new Date(niches[0].lastUpdated).toLocaleDateString() : 'N/A'}</span>.
          </p>
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
                We use the YouTube Data API v3 and Google Trends to analyze real channel and video metrics. 
                For each niche, we scan 50+ channels to measure subscriber counts, view distribution, and engagement rates. 
                Difficulty scores are calculated algorithmically based on competition levels, top channel dominance, 
                and production requirements. CPM estimates are based on published industry reports by advertising vertical.
              </p>
            </details>
            <details className="group p-6 rounded-xl bg-slate-900 border border-slate-800 open:bg-slate-800/50 transition-all">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-slate-200">
                Is this suitable for beginners?
                <span className="transform group-open:rotate-180 transition-transform text-emerald-400">▼</span>
              </summary>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Yes! Filter by &quot;Low&quot; difficulty to find niches with less competition and lower production requirements. 
                These niches typically have no dominant players and are ideal for new creators starting faceless channels.
              </p>
            </details>
            <details className="group p-6 rounded-xl bg-slate-900 border border-slate-800 open:bg-slate-800/50 transition-all">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-slate-200">
                How often is the data updated?
                <span className="transform group-open:rotate-180 transition-transform text-emerald-400">▼</span>
              </summary>
              <p className="mt-4 text-slate-400 leading-relaxed">
                We refresh all metrics monthly to keep competition scores, engagement rates, and trend data current. 
                New niches are also added regularly as we identify emerging opportunities.
              </p>
            </details>
            <details className="group p-6 rounded-xl bg-slate-900 border border-slate-800 open:bg-slate-800/50 transition-all">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-slate-200">
                Are CPM estimates accurate?
                <span className="transform group-open:rotate-180 transition-transform text-emerald-400">▼</span>
              </summary>
              <p className="mt-4 text-slate-400 leading-relaxed">
                CPM estimates are based on industry averages by advertising vertical. Actual CPMs vary significantly 
                based on your audience location, video length, viewer demographics, season, and channel authority. 
                Our ranges represent typical values for US-based audiences.
              </p>
            </details>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>© 2026 NicheHunt. All rights reserved.</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <a href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          </div>
          <p className="mt-3 text-xs">Data sourced from YouTube Data API v3 & Google Trends. CPM estimates are industry averages and may vary.</p>
        </footer>
      </main>
    </div>
  );
}
