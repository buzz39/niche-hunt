'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { niches } from './data/niches';

const CATEGORIES = ['all', ...Array.from(new Set(niches.map(n => n.category)))];
const TOP_PICK_IDS = [1, 8, 28, 31, 22, 42]; // Credit Card Rewards, Tax Optimization, Cybersecurity Tips, Software Comparisons, Freelancing Guide, Sleep Optimization

const GUMROAD_URL = 'https://tweetpreneur.gumroad.com/l/nichehunt';

function DifficultyBar({ score, label }: { score: number; label: string }) {
  const color = score <= 30 ? 'bg-emerald-500' : score <= 60 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor = score <= 30 ? 'text-emerald-400' : score <= 60 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-medium ${textColor}`}>{label}</span>
    </div>
  );
}

function TrendBadge({ status }: { status: string }) {
  if (status === 'Rising') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">↑ Rising</span>;
  if (status === 'Declining') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">↓ Declining</span>;
  if (status === 'Stable') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">→ Stable</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">— Unknown</span>;
}

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'cpm'>('cpm');
  const [searchQuery, setSearchQuery] = useState('');
  const [unlockAnimation, setUnlockAnimation] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nichehunt_unlocked');
    if (stored === 'true') setIsUnlocked(true);
  }, []);

  const handlePurchase = () => {
    // Try Gumroad overlay first, fall back to new tab
    const a = document.createElement('a');
    a.href = GUMROAD_URL;
    a.classList.add('gumroad-button');
    a.dataset.gumroadOverlay = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [verifyError, setVerifyError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleRestore = async () => {
    const key = prompt('Enter your Gumroad license key (from your purchase confirmation email):');
    if (!key || key.trim().length < 5) return;

    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: key.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('nichehunt_unlocked', 'true');
        localStorage.setItem('nichehunt_key', key.trim());
        setUnlockAnimation(true);
        setTimeout(() => {
          setIsUnlocked(true);
          setUnlockAnimation(false);
        }, 600);
      } else {
        setVerifyError(data.error || 'Invalid license key. Please check your purchase email for the correct key.');
        alert(data.error || 'Invalid license key. Please check your purchase email.');
      }
    } catch {
      setVerifyError('Verification failed. Please try again.');
      alert('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const parseCpmMin = (cpm: string) => {
    const match = cpm.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const filteredNiches = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? niches
      : niches.filter(n => n.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.name.toLowerCase().includes(q) ||
        n.keyword.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.monetization.toLowerCase().includes(q)
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'difficulty') return a.difficultyScore - b.difficultyScore;
      if (sortBy === 'cpm') return parseCpmMin(b.cpm) - parseCpmMin(a.cpm);
      return 0;
    });
  }, [selectedCategory, sortBy, searchQuery]);

  const FREE_PREVIEW_COUNT = 10;
  const visibleNiches = isUnlocked ? filteredNiches : filteredNiches.slice(0, FREE_PREVIEW_COUNT);
  const lockedCount = filteredNiches.length - FREE_PREVIEW_COUNT;
  const totalNiches = niches.length;
  const lowDiffCount = niches.filter(n => n.difficulty === 'Low').length;
  const categories = new Set(niches.map(n => n.category)).size;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400">
            <span className="text-2xl">⚡</span> NicheHunt
          </a>
          <div className="flex items-center gap-3">
            <a href="/blog" className="text-sm text-slate-400 hover:text-slate-200 transition-colors hidden sm:block">Blog</a>
            {isUnlocked ? (
              <span className="px-4 py-2 rounded-full bg-slate-800 text-slate-400 text-sm font-medium">✓ Premium Member</span>
            ) : (
              <button
                onClick={handlePurchase}
                className="px-4 py-2 rounded-full font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-sm"
              >
                Get Access — $9
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-sm text-slate-400 mb-4">
            Updated March 2026 • {totalNiches} Verified Niches
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Stop Guessing. <br className="hidden md:block" /> Start Creating.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            A data-driven database of high-CPM, low-competition YouTube niches.
            Analyzed using YouTube API data to help you build profitable faceless channels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {!isUnlocked && (
              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              >
                Unlock Full Database — $9
              </button>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Data sourced from YouTube API</span>
              {!isUnlocked && (
                <button onClick={handleRestore} disabled={verifying} className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2 transition-colors disabled:opacity-50">
                  {verifying ? 'Verifying...' : 'Restore Purchase'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input
              type="text"
              placeholder="Search niches by name, keyword, or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
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
            { key: 'cpm' as const, label: 'Highest CPM' },
            { key: 'difficulty' as const, label: 'Easiest First' },
            { key: 'name' as const, label: 'Name' },
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
        <div className={`relative rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/30 backdrop-blur-sm transition-all duration-500 ${unlockAnimation ? 'scale-[1.01] ring-2 ring-emerald-500' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Niche Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Est. CPM</th>
                  <th className="p-4 font-medium">Difficulty</th>
                  <th className="p-4 font-medium">Trend</th>
                  <th className="p-4 font-medium">Monetization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {visibleNiches.map((niche) => (
                  <tr key={niche.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{niche.name}</span>
                        {TOP_PICK_IDS.includes(niche.id) && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-700 uppercase tracking-wider">⭐ Top Pick</span>
                        )}
                      </div>
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
                      <span className="text-lg font-bold text-emerald-400">{niche.cpm}</span>
                    </td>
                    <td className="p-4">
                      <DifficultyBar score={niche.difficultyScore} label={`${niche.difficulty} (${niche.difficultyScore}/100)`} />
                    </td>
                    <td className="p-4"><TrendBadge status={niche.trend.status} /></td>
                    <td className="p-4 text-slate-400 text-sm">{niche.monetization}</td>
                  </tr>
                ))}

                {/* Blurred Rows */}
                {!isUnlocked && Array(5).fill(null).map((_, i) => (
                  <tr key={`blur-${i}`} className="blur-[6px] select-none pointer-events-none opacity-40">
                    <td className="p-4 text-slate-300">Premium Niche #{i + 6}</td>
                    <td className="p-4"><span className="bg-slate-800 rounded px-6 py-1">&nbsp;</span></td>
                    <td className="p-4 text-emerald-400 font-bold">$XX-$XX</td>
                    <td className="p-4"><div className="w-16 h-2 rounded bg-slate-700" /></td>
                    <td className="p-4"><span className="bg-slate-800 rounded px-4 py-1">&nbsp;</span></td>
                    <td className="p-4 text-slate-400">Ads, Affiliate</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paywall Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex flex-col items-center justify-end pb-12 z-10">
              <div className="text-center space-y-4">
                <p className="text-slate-300 text-lg font-medium">
                  Unlock {lockedCount > 0 ? `${lockedCount}+` : 'all'} remaining niches with full metrics
                </p>
                <button
                  onClick={handlePurchase}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  Get Instant Access — $9
                </button>
                <p className="text-xs text-slate-500">One-time payment • 30-day money-back guarantee</p>
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
            Data is refreshed monthly.
          </p>
        </div>

        {/* Blog CTA */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">📝 Learn YouTube Growth Strategies</h3>
              <p className="text-slate-400 text-sm">Read our guides on finding niches, maximizing CPM, and building faceless channels.</p>
            </div>
            <a href="/blog" className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors whitespace-nowrap border border-slate-700">
              Read the Blog →
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How is this data sourced?', a: 'We use the YouTube Data API v3 and Google Trends to analyze real channel and video metrics. For each niche, we scan 50+ channels to measure subscriber counts, view distribution, and engagement rates. Difficulty scores are calculated algorithmically based on competition levels, top channel dominance, and production requirements. CPM estimates are based on published industry reports by advertising vertical.' },
              { q: 'Is this suitable for beginners?', a: 'Yes! Filter by "Low" difficulty to find niches with less competition and lower production requirements. These niches typically have no dominant players and are ideal for new creators starting faceless channels.' },
              { q: 'How often is the data updated?', a: 'We refresh all metrics monthly to keep competition scores, engagement rates, and trend data current. New niches are also added regularly as we identify emerging opportunities.' },
              { q: 'Are CPM estimates accurate?', a: 'CPM estimates are based on industry averages by advertising vertical. Actual CPMs vary significantly based on your audience location, video length, viewer demographics, season, and channel authority. Our ranges represent typical values for US-based audiences.' },
            ].map((faq, i) => (
              <details key={i} className="group p-6 rounded-xl bg-slate-900 border border-slate-800 open:bg-slate-800/50 transition-all">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between text-slate-200">
                  {faq.q}
                  <span className="transform group-open:rotate-180 transition-transform text-emerald-400">▼</span>
                </summary>
                <p className="mt-4 text-slate-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>© 2026 NicheHunt. All rights reserved.</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <a href="/blog" className="hover:text-slate-400 transition-colors">Blog</a>
            <span>·</span>
            <a href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          </div>
          <p className="mt-3 text-xs">Data sourced from YouTube Data API v3 & Google Trends. CPM estimates are industry averages and may vary.</p>
          <p className="mt-1 text-xs">Contact: hello@g-compilations.com</p>
        </footer>
      </main>
    </div>
  );
}
