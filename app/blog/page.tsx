import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '../data/blog';

export const metadata: Metadata = {
  title: 'Blog — NicheHunt | YouTube Niche Research & Strategy',
  description: 'Learn how to find profitable YouTube niches, maximize CPM, and build faceless channels. Data-driven guides from the NicheHunt team.',
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400">
            <span className="text-2xl">⚡</span> NicheHunt
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            ← Back to Database
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-slate-400 mb-12">
          Data-driven guides to YouTube niche selection, CPM optimization, and building faceless channels.
        </p>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-slate-400">{post.description}</p>
                <span className="inline-block mt-3 text-emerald-400 text-sm font-medium">Read more →</span>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-900/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Find Your Niche?</h2>
          <p className="text-slate-400 mb-6">46+ YouTube niches with CPM data, difficulty scores, and trend analysis.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all">
            Explore the Database →
          </Link>
        </div>

        <footer className="mt-16 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>© 2026 NicheHunt. All rights reserved.</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link href="/" className="hover:text-slate-400 transition-colors">Database</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
