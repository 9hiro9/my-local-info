import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 antialiased">
      {/* 상단 바 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 py-4 shadow-sm">
        <div className="mx-auto max-w-4xl px-6 relative flex flex-col items-center justify-center">
          {/* 상단 네비게이션 */}
          <div className="sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/about" className="text-sm font-bold text-orange-600">
              ℹ️ 소개
            </Link>
          </div>

          <div className="sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 mb-4 sm:mb-0">
            <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 text-slate-600 font-bold shadow-sm border border-slate-100 hover:bg-slate-100 transition-all text-sm">
              🖋️ 블로그
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
              우리 동네의 따끈따끈한 행사와 혜택을 전해드립니다.
            </p>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-gray-100 text-center">사이트 소개</h2>
          
          <div className="space-y-12">
            {/* 운영 목적 */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                🎯 운영 목적
              </h3>
              <p className="text-slate-600 leading-relaxed">
                '성남시 생활 정보' 사이트는 성남 시민 여러분이 매일 쏟아지는 방대한 공공 데이터 속에서 
                <strong> 자신에게 꼭 필요한 혜택과 즐거운 행사 소식</strong>을 놓치지 않도록 돕기 위해 만들어졌습니다. 
                복잡한 공고문을 일일이 확인하지 않아도, 우리 동네의 가장 중요한 정보를 쉽고 친절하게 전달해 드립니다.
              </p>
            </section>

            {/* 데이터 출처 */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                🏛️ 데이터 출처
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                본 사이트에서 제공하는 모든 정보는 대한민국 정부의 공식 창구인 <strong>공공데이터포털(data.go.kr)</strong>의 
                API를 통해 실시간 또는 정기적으로 수집되고 있습니다.
              </p>
              <ul className="list-disc pl-5 text-slate-500 space-y-2 text-sm">
                <li>행정안전부 정부24 공공서비스 목록</li>
                <li>성남시청 및 경기도청 지역 행사 데이터</li>
                <li>기타 지방자치단체 지원사업 정보</li>
              </ul>
            </section>

            {/* 콘텐츠 생성 방식 */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                🤖 콘텐츠 생성 방식
              </h3>
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                <p className="text-slate-700 leading-relaxed mb-4">
                  효율적이고 빠른 정보 전달을 위해 <strong>인공지능(AI) 기술</strong>을 활용하고 있습니다. 
                  수집된 원문 데이터를 AI가 분석하여 독자가 이해하기 쉬운 블로그 형식의 글로 가공합니다.
                </p>
                <div className="text-xs text-orange-600 flex items-start gap-2">
                  <span>⚠️</span>
                  <p>
                    AI가 작성한 정보는 원문의 내용과 간혹 차이가 있을 수 있습니다. 
                    정확한 신청 자격이나 제출 서류 등은 반드시 글 하단에 첨부된 '원문 출처' 링크를 통해 
                    최종적으로 확인하시기를 권장합니다.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </main>

      {/* 푸터 */}
      <footer className="mt-20 border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 text-center text-slate-400 text-sm">
          <p className="font-bold text-slate-900 mb-2">성남시 생활 정보</p>
          <p>&copy; 2026. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
