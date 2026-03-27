import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 antialiased">
      {/* 상단 바 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 py-4 shadow-sm">
        <div className="mx-auto max-w-4xl px-6 relative flex flex-col items-center justify-center">
          {/* 상단 네비게이션 (좌측 소개, 우측 홈) */}
          <div className="sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/about" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">
              ℹ️ 소개
            </Link>
          </div>

          {/* 우측 상단 홈 버튼 (블로그 페이지이므로 홈으로 유도) */}
          <div className="sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 text-slate-600 font-bold shadow-sm border border-slate-100 hover:bg-slate-100 transition-all text-sm">
              🏠 홈으로
            </Link>
          </div>
          
          {/* 중앙 로고 및 타이틀 */}
          <Link href="/" className="flex flex-col items-center gap-1 group text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🏠</span>
              <span className="text-orange-600">성남시</span>
              <span className="text-slate-800 font-extrabold">생활 정보</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide">
              성남시의 유용한 생활 정보를 깊이 있게 전해드립니다.
            </p>
          </Link>
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
