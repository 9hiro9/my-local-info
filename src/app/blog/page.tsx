import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

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
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">블로그</h1>
          <p className="text-slate-500">성남시의 유용한 생활 정보를 깊이 있게 전해드립니다.</p>
        </div>

        <div className="grid gap-6">
          {allPostsData.length > 0 ? (
            allPostsData.map(({ slug, date, title, summary, category }) => (
              <Link key={slug} href={`/blog/${slug}`} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-300 transition-all hover:shadow-md block group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{category}</span>
                  <span className="text-xs text-slate-400">{date}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 mb-2 transition-colors">
                  {title}
                </h2>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                  {summary}
                </p>
                <div className="mt-4 text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  더 읽어보기 &rarr;
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
              <p className="text-slate-400">등록된 블로그 포스트가 없습니다.</p>
            </div>
          )}
        </div>
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
