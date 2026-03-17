import Link from "next/link";
import localInfoData from "../../../../public/data/local-info.json";
import { notFound } from "next/navigation";

// 정적 배포(export)를 위해 모든 가능한 ID를 미리 정의합니다.
export async function generateStaticParams() {
  return localInfoData.map((item) => ({
    id: item.id,
  }));
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = localInfoData.find((info) => info.id === id);

  if (!item) {
    notFound();
  }

  const isEvent = item.category === "행사";
  const themeColor = isEvent ? "green" : "blue";

  return (
    <div className={`min-h-screen bg-${themeColor}-50/30 pb-12 font-sans text-gray-800`}>
      {/* 상단 헤더 (메인과 통일) */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🏘️</span>
            <h1 className="text-xl font-bold text-orange-600 tracking-tight">
              성남시 생활 정보
            </h1>
          </Link>
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
          >
            <span>←</span> 목록으로
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 상단 포인트 컬러 바 */}
          <div className={`h-2 bg-${themeColor}-500 shadow-sm`}></div>
          
          <div className="p-6 sm:p-10">
            {/* 카테고리 태그 */}
            <div className="mb-6">
              <span className={`inline-block bg-${themeColor}-100 text-${themeColor}-700 text-sm font-bold px-3 py-1 rounded-full`}>
                {item.category}
              </span>
            </div>

            {/* 제목 */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
              {item.title}
            </h2>

            {/* 주요 정보 요약 카드 */}
            <div className={`grid gap-4 sm:grid-cols-2 bg-${themeColor}-50/50 p-6 rounded-2xl border border-${themeColor}-100/50 mb-10`}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🗓️</span>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">기간</p>
                    <p className="text-gray-800 font-medium">{item.startDate} ~ {item.endDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">장소</p>
                    <p className="text-gray-800 font-medium">{item.location}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">대상</p>
                    <p className="text-gray-800 font-medium">{item.targetAudience}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="prose prose-orange max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">상세 정보</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {item.summary}
              </p>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <a
                href={item.url}
                className={`flex-1 inline-flex items-center justify-center gap-2 bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all active:scale-95`}
              >
                자세히 보기 <span className="text-lg">→</span>
              </a>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all active:scale-95"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </article>
        
        {/* 푸터 공지 */}
        <p className="mt-8 text-center text-sm text-gray-400">
          정보 출처: 공공데이터포털 (data.go.kr) | 본 정보는 사정에 따라 변경될 수 있습니다.
        </p>
      </main>
    </div>
  );
}
