'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface InfoItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
  blogSlug?: string;
}

interface LocalData {
  festivals: InfoItem[];
  benefits: InfoItem[];
  lastUpdated: string;
}

export default function Home() {
  const [data, setData] = useState<LocalData | null>(null);

  useEffect(() => {
    fetch('/data/local-info.json')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans text-gray-400">
      정보를 불러오는 중입니다...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 antialiased">
      {/* 구조화 데이터 주입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            data.festivals.map((f) => ({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": f.title,
              "startDate": f.startDate,
              "endDate": f.endDate,
              "location": {
                "@type": "Place",
                "name": f.location,
                "address": "성남시"
              },
              "description": f.summary
            }))
          )
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            data.benefits.map((b) => ({
              "@context": "https://schema.org",
              "@type": "GovernmentService",
              "serviceType": "Benefit",
              "name": b.title,
              "description": b.summary,
              "provider": {
                "@type": "GovernmentOrganization",
                "name": "성남시"
              }
            }))
          )
        }}
      />
      {/* 깔끔한 상단 바 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 py-4 shadow-sm">
        <div className="mx-auto max-w-4xl px-6 relative flex flex-col items-center justify-center">
          {/* 상단 네비게이션 (좌측 소개, 우측 블로그) */}
          <div className="sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/about" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">
              ℹ️ 소개
            </Link>
          </div>

          {/* 우측 상단 블로그 버튼 */}
          <div className="sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 text-orange-600 font-bold shadow-sm border border-orange-100 hover:bg-orange-100 transition-all text-sm group">
              <span className="group-hover:rotate-12 transition-transform">🖋️</span> 블로그
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
              우리 동네의 따끈따끈한 행사와 혜택을 한눈에 확인하세요!
            </p>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* 미니멀한 메인 카드 */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
              성남시의 최신 정보와 <br />
              다양한 혜택을 확인하세요.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-6">
              우리 동네의 축제 소식부터 정부가 제공하는 각종 지원금까지, <br className="hidden sm:block" />
              당신에게 필요한 정보를 한곳에 모았습니다.
            </p>
            <div className="flex gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-inset ring-blue-700/10">
                #업데이트 완료
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold ring-1 ring-inset ring-green-700/10">
                #공공데이터 연동
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-12 sm:grid-cols-1">
          {/* 축제 및 행사 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
              <h3 className="text-xl font-bold text-slate-900">🎉 주요 축제 및 행사</h3>
            </div>
            <div className="space-y-4">
              {data.festivals.map((item) => (
                <Link key={item.id} href={item.blogSlug ? `/blog/${item.blogSlug}` : '/blog'} className="group flex items-start gap-6 bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-300 transition-all hover:shadow-md cursor-pointer block">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                    {item.title.includes('축제') ? '🌸' : '🏢'}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{item.category}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 mb-2">
                      {item.title}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">📍 {item.location}</span>
                      <span className="flex items-center gap-1">📅 {item.startDate}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 지원금 및 혜택 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
              <h3 className="text-xl font-bold text-slate-900">💰 지원금 및 혜택</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.benefits.map((item) => (
                <Link key={item.id} href={item.blogSlug ? `/blog/${item.blogSlug}` : '/blog'} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-sm transition-all group block">
                  <div className="mb-4 text-2xl group-hover:scale-110 transition-transform w-fit">🎁</div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                  <p className="text-xs font-medium text-slate-400 italic">대상: {item.target}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 심플한 푸터 */}
      <footer className="mt-20 border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">성남시 생활 정보</span>
            <span>|</span>
            <span>데이터 출처: 공공데이터포털</span>
          </div>
          <div className="text-center sm:text-right">
            <p>최종 업데이트: {data.lastUpdated}</p>
            <p className="mt-1 text-xs">&copy; 2026. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

