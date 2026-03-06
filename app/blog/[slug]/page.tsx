import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '../../data/blog';
import { BlogContent } from './BlogContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — NicheHunt Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400">
            <span className="text-2xl">⚡</span> NicheHunt
          </Link>
          <Link href="/blog" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
            ← All Posts
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <article>
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-6">
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>{post.author}</span>
          </div>

          <BlogContent content={post.content} />
        </article>

        {/* AdSense ad slot */}
        <div className="my-12 text-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-2892900713777311"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* CTA */}
        <div className="my-12 p-8 rounded-2xl bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-900/30 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Find Your Perfect YouTube Niche</h2>
          <p className="text-slate-400 mb-6">170+ niches analyzed with YouTube API data. CPM estimates, difficulty scores, and trend data.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all">
            Explore the Database — $9
          </Link>
        </div>

        {/* Related Posts */}
        {otherPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">More from NicheHunt</h3>
            <div className="space-y-4">
              {otherPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                  <h4 className="font-semibold text-white hover:text-emerald-400 transition-colors">{p.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-16 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>© 2026 NicheHunt. All rights reserved.</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link href="/" className="hover:text-slate-400 transition-colors">Database</Link>
            <span>·</span>
            <Link href="/blog" className="hover:text-slate-400 transition-colors">Blog</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
          </div>
          <p className="mt-2 text-xs">Contact: hello@g-compilations.com</p>
        </footer>
      </main>
    </div>
  );
}
