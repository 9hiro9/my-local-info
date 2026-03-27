import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const postData = getPostData(slug);
  
  if (!postData) return {};
  
  return {
    title: `${postData.title} | 성남시 생활 정보`,
    description: postData.summary,
    openGraph: {
      title: postData.title,
      description: postData.summary,
      type: 'article',
      publishedTime: postData.date,
      authors: ['성남시 생활 정보'],
      tags: postData.tags,
    },
  };
}

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

  // local-info.json에서 원문 링크 찾기
  let sourceLink = '#';
  try {
    const dataPath = path.join(process.cwd(), 'public/data/local-info.json');
    const localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const allItems = [...(localData.festivals || []), ...(localData.benefits || [])];
    const matchedItem = allItems.find(item => item.blogSlug === slug || String(item.id) === slug);
    if (matchedItem && matchedItem.link) {
      sourceLink = matchedItem.link;
    }
  } catch (e) {
    console.error('데이터 로드 실패:', e);
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 antialiased">
      {/* 상단 바 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 py-4 shadow-sm">
        <div className="mx-auto max-w-4xl px-6 relative flex flex-col items-center justify-center">
          {/* 상단 네비게이션 (좌측 소개, 우측 목록) */}
          <div className="sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/about" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">
              ℹ️ 소개
            </Link>
          </div>

          <div className="sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 font-bold shadow-sm border border-blue-100 hover:bg-blue-100 transition-all text-sm">
              📋 목록보기
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
              성남시민을 위한 상세 정보를 전해드립니다.
            </p>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-blue-600 mb-10 hover:translate-x-[-4px] transition-transform">
          &larr; 목록으로 돌아가기
        </Link>

        <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="p-8 border-b border-gray-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  {postData.category}
                </span>
                <span className="text-xs text-slate-400">{postData.date}</span>
              </div>
              <span className="text-xs font-medium text-slate-400">최종 업데이트: {postData.date}</span>
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
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-a:text-blue-600 mb-12">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {postData.content}
              </ReactMarkdown>
            </div>

            {/* E-E-A-T 영역: 출처 및 AI 안내 */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 text-sm text-slate-600">
                <p className="mb-4">
                  <span className="font-bold">📍 원문 출처:</span>{' '}
                  <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                    {sourceLink !== '#' ? sourceLink : '공공데이터포털'}
                  </a>
                </p>
                <p className="leading-relaxed text-slate-500">
                  ⚠️ 이 글은 공공데이터포털(<a href="http://data.go.kr" target="_blank" rel="noopener noreferrer" className="hover:underline">data.go.kr</a>)의 정보를 바탕으로 AI가 작성하였습니다. 공공기관의 정책 변경 등에 따라 실제 내용과 차이가 있을 수 있으므로, 정확한 내용은 반드시 위 원문 링크를 통해 확인해 주시기 바랍니다.
                </p>
              </div>
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
