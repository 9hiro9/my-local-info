import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-orange-50/50 pb-12 font-sans text-gray-800">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🏘️</span>
            <h1 className="text-2xl font-bold text-orange-600 tracking-tight">
              성남시 생활 정보
            </h1>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">홈</Link>
            <Link href="/blog" className="text-sm font-bold text-orange-600 border-b-2 border-orange-600 transition-colors">블로그</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">동네 소식 블로그 📮</h2>
          <p className="text-gray-500">우리 동네의 유용한 정보와 소식을 깊이 있게 전해드립니다.</p>
        </div>

        <div className="grid gap-8">
          {allPostsData.length > 0 ? (
            allPostsData.map(({ slug, date, title, summary, category, tags }) => (
              <article key={slug} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">{category}</span>
                  <time className="text-sm text-gray-400 font-medium">{date}</time>
                </div>
                <Link href={`/blog/${slug}`} className="group">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3">
                    {title}
                  </h3>
                </Link>
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-2">
                  {summary}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-400 font-medium whitespace-nowrap">#{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${slug}`} className="inline-flex items-center text-orange-600 font-bold hover:gap-1.5 transition-all">
                  읽어보기 <span className="ml-1">→</span>
                </Link>
              </article>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-400">아직 등록된 게시글이 없습니다. 🏗️</p>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 mt-20 pt-8 border-t border-orange-200/60 text-center text-sm text-gray-500">
        <p>© 2024 성남시 생활 정보 블로그</p>
      </footer>
    </div>
  );
}
