import Link from 'next/link';
import localData from '../../../../public/data/local-info.json';

// 정적 배포를 위해 모든 가능한 ID를 미리 정의합니다.
export async function generateStaticParams() {
  const allItems = [...localData.festivals, ...localData.benefits];
  return allItems.map((item) => ({
    id: item.id,
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allItems = [...localData.festivals, ...localData.benefits];
  const item = allItems.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center shadow-inner">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">정보를 찾을 수 없습니다.</h1>
        <Link href="/" className="text-blue-600 hover:underline">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 antialiased pb-20">
      {/* 상단 바 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto max-w-3xl flex items-center justify-between h-16 px-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="text-blue-600">성남시</span> 생활 정보
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            목록으로
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* 상세 카드 */}
        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* 헤더 섹션 */}
          <div className="p-8 sm:p-12 border-b border-gray-100">
            <div className="mb-6 flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ring-1 ring-inset ${
                item.category === '행사' ? 'bg-orange-50 text-orange-700 ring-orange-700/10' : 'bg-green-50 text-green-700 ring-green-700/10'
              }`}>
                {item.category}
              </span>
              <span className="text-sm text-slate-400">ID: {item.id}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-8">
              {item.title}
            </h2>

            {/* 주요 정보 요약 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 bg-slate-50 rounded-xl p-6 border border-gray-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">진행 기간</p>
                <p className="font-semibold text-slate-900">{item.startDate === item.endDate ? item.startDate : `${item.startDate} ~ ${item.endDate}`}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">장소</p>
                <p className="font-semibold text-slate-900">{item.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">대상</p>
                <p className="font-semibold text-slate-900">{item.target}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">문의처</p>
                <p className="font-semibold text-slate-900">상세내용 참조</p>
              </div>
            </div>
          </div>

          {/* 본문 내용 */}
          <div className="p-8 sm:p-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              상세 설명
            </h3>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-slate-600 mb-8 whitespace-pre-wrap">
                {item.description || item.summary}
              </p>
            </div>

            {/* 버튼들 */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-6 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                자세히 보기 &rarr;
              </a>
              <Link 
                href="/"
                className="flex-1 inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white text-slate-600 font-bold text-lg border border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </article>
      </main>

      {/* 하단 푸터 */}
      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>&copy; 2026 성남시 생활 정보. {localData.lastUpdated} 업데이트됨.</p>
      </footer>
    </div>
  );
}
