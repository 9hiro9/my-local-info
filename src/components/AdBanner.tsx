'use client';

import { useEffect } from 'react';

export default function AdBanner() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // 광고 스크립트가 로드되었는지 확인 후 광고 요청 푸시
    if (adsenseId && adsenseId !== "나중에_입력") {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [adsenseId]);

  // ID가 설정되어 있지 않거나 '나중에_입력'인 경우 아무것도 렌더링하지 않음
  if (!adsenseId || adsenseId === "나중에_입력") {
    return null;
  }

  return (
    <div className="my-10 w-full overflow-hidden flex justify-center bg-gray-50/50 rounded-lg border border-dashed border-gray-200 py-4">
      {/* 실제 광고 영역 */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={`ca-pub-${adsenseId}`}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {/* 개발자용 안내 (ID 미설정 시 보이지 않음) */}
      <div className="text-[10px] text-gray-300 absolute">ADVERTISEMENT</div>
    </div>
  );
}
