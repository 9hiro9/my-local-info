'use client';

export default function CoupangBanner() {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;

  // ID가 설정되어 있지 않거나 '나중에_입력'인 경우 아무것도 렌더링하지 않음
  if (!partnerId || partnerId === "나중에_입력") {
    return null;
  }

  return (
    <div className="my-6 w-full overflow-hidden flex justify-center border border-gray-100 rounded-lg shadow-sm bg-white p-2">
      {/* 쿠팡 파트너스 다이내믹 배너 또는 고정 배너 예시 */}
      <iframe 
        src={`https://ads-partners.coupang.com/widgets.html?id=${partnerId}&template=carousel&trackingCode=AF1234567&subId=&width=680&height=140`} 
        width="100%" 
        height="140" 
        frameBorder="0" 
        scrolling="no" 
        referrerPolicy="unsafe-url"
        title="쿠팡 파트너스 광고"
      ></iframe>
      {/* 쿠팡 파트너스 이용 안내 문구 (필수사항) */}
      <p className="text-[10px] text-gray-400 text-center mt-1">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
