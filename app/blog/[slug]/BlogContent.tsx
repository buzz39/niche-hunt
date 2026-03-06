'use client';

import ReactMarkdown from 'react-markdown';

export function BlogContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-emerald max-w-none
      prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:mb-8
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
      prose-p:text-slate-300 prose-p:leading-relaxed
      prose-li:text-slate-300
      prose-strong:text-white
      prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-emerald-500 prose-blockquote:text-slate-400
      prose-code:text-emerald-400 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-table:text-sm
      prose-th:text-slate-300 prose-th:border-slate-700
      prose-td:border-slate-700
    ">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
