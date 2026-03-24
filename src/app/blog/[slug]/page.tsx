import Link from 'next/link';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = getPostData(slug);

  if (!postData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 antialiased">
      {/* 상단 바 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto max-w-4xl flex items-center justify-between h-16 px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2 outline-none">
            <span className="text-blue-600">성남시</span> 생활 정보
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
            <Link href="/blog" className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-blue-600 mb-10 hover:translate-x-[-4px] transition-transform">
          &larr; 목록으로 돌아가기
        </Link>

        <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                {postData.category}
              </span>
              <span className="text-xs text-slate-400">{postData.date}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {postData.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {postData.tags.map((tag) => (
                <span key={tag} className="text-sm text-slate-500">#{tag}</span>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-a:text-blue-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {postData.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </main>

      {/* 푸터 */}
      <footer className="mt-20 border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">성남시 생활 정보</span>
            <span>|</span>
            <span>데이터 출처: 공공데이터포털</span>
          </div>
          <div className="text-center sm:text-right">
            <p>&copy; 2026. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
