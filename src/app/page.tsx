import Image from "next/image";
import localInfoData from "../../public/data/local-info.json";

export default function Home() {
  const events = localInfoData.filter((item) => item.category === "행사");
  const benefits = localInfoData.filter((item) => item.category === "혜택");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-orange-50/50 pb-12 font-sans text-gray-800">
      {/* 1. 상단 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏘️</span>
            <h1 className="text-2xl font-bold text-orange-600 tracking-tight">
              성남시 생활 정보
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium hidden sm:block">
            우리 동네 소식을 한눈에!
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-12">
        {/* 2. 행사/축제 섹션 */}
        <section>
          <div className="mb-6 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-500 pl-3 flex items-center gap-2">
              🎉 이번 달 행사/축제 <span className="text-xl">🌱</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => (
              <a
                key={item.id}
                href={`/details/${item.id}`}
                className="group bg-white rounded-2xl p-5 shadow-sm border border-green-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full"
              >
                <div className="mb-3">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 shadow-sm">
                    {item.location}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                  {item.summary}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-50 text-xs text-gray-500 space-y-1.5">
                  <p className="flex items-center gap-1.5">
                    <span className="opacity-70">🗓️</span>
                    {item.startDate} ~ {item.endDate}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="opacity-70">👥</span>
                    {item.targetAudience}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 섹션 */}
        <section>
          <div className="mb-6 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-400 pl-3">
              💰 우리 동네 지원금/혜택
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map((item) => (
              <a
                key={item.id}
                href={`/details/${item.id}`}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-full relative overflow-hidden"
              >
                {/* 카드 상단 장식 바 */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                    <span>👤</span> {item.targetAudience}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed flex-grow">
                  {item.summary}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-100">
                   <p className="flex items-center gap-1.5">
                    <span>📍</span>
                    <span className="truncate max-w-[150px]">{item.location}</span>
                  </p>
                  <p>
                    ~ {item.endDate} 까지
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* 4. 푸터 */}
      <footer className="max-w-4xl mx-auto px-4 mt-16 pt-8 border-t border-orange-200/60 text-center text-sm text-gray-500">
        <p className="mb-2">본 사이트에 제공되는 정보는 단순 참고용입니다.</p>
        <p>데이터 출처: 공공데이터포털 (data.go.kr)</p>
        <p className="mt-4 text-xs font-medium text-gray-400">
          마지막 업데이트: {today}
        </p>
      </footer>
    </div>
  );
}
