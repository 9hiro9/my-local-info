const fs = require('fs');
const path = require('path');

async function fetchPublicData() {
  try {
    const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
      console.error('환경변수(PUBLIC_DATA_API_KEY 또는 GEMINI_API_KEY)가 설정되지 않았습니다.');
      return;
    }

    const DATA_PATH = path.join(__dirname, '../public/data/local-info.json');
    let localData;
    try {
      localData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch (err) {
      console.error('기존 데이터를 읽는 중 오류 발생:', err);
      return;
    }

    // [1단계] 공공데이터포털 API에서 데이터 가져오기
    const publicDataUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${PUBLIC_DATA_API_KEY}`;
    const publicResponse = await fetch(publicDataUrl);
    const publicJson = await publicResponse.json();

    if (!publicJson.data || !Array.isArray(publicJson.data)) {
      console.error('공공데이터 형식이 올바르지 않습니다.');
      return;
    }

    // 가중치 기반 필터링
    let filteredItems = publicJson.data.filter(item => 
      (item.서비스명 || '').includes('성남') || 
      (item.서비스목적요약 || '').includes('성남') || 
      (item.지원대상 || '').includes('성남') || 
      (item.소관기관명 || '').includes('성남')
    );

    if (filteredItems.length === 0) {
      filteredItems = publicJson.data.filter(item => 
        (item.서비스명 || '').includes('경기') || 
        (item.서비스목적요약 || '').includes('경기') || 
        (item.지원대상 || '').includes('경기') || 
        (item.소관기관명 || '').includes('경기')
      );
    }

    if (filteredItems.length === 0) {
      filteredItems = publicJson.data;
    }

    // [2단계] 기존 데이터와 비교 (name 또는 title 기준)
    const existingTitles = new Set([
      ...(localData.festivals || []).map(i => i.title || i.name),
      ...(localData.benefits || []).map(i => i.title || i.name)
    ]);

    const newItems = filteredItems.filter(item => !existingTitles.has(item.서비스명));

    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다');
      return;
    }

    // 새로운 항목 중 1개만 선택
    const targetItem = newItems[0];

    // [3단계] Gemini AI로 새 항목 1개만 가공
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터: ${JSON.stringify(targetItem)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiJson = await geminiResponse.json();
    let aiText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      console.error('Gemini 응답을 받지 못했습니다. 전체 응답:', JSON.stringify(geminiJson, null, 2));
      return;
    }

    // 마크다운 코드 블록 제거 및 JSON 파싱
    aiText = aiText.replace(/```json|```/g, '').trim();
    let processedItem;
    try {
      processedItem = JSON.parse(aiText);
    } catch (err) {
      console.error('AI 응답 파싱 실패:', aiText);
      return;
    }

    // [4단계] 기존 데이터에 추가 (schema에 맞춰 name -> title 변환)
    const newItem = {
      id: processedItem.id || `auto-${Date.now()}`,
      title: processedItem.name || processedItem.title,
      category: processedItem.category || '혜택',
      startDate: processedItem.startDate,
      endDate: processedItem.endDate,
      location: processedItem.location,
      target: processedItem.target,
      summary: processedItem.summary,
      link: processedItem.link || targetItem.상세URL || '#'
    };

    if (newItem.category === '행사') {
      localData.festivals.push(newItem);
    } else {
      localData.benefits.push(newItem);
    }

    localData.lastUpdated = new Date().toISOString().split('T')[0];

    fs.writeFileSync(DATA_PATH, JSON.stringify(localData, null, 2), 'utf8');
    console.log(`추가 완료: ${newItem.title}`);

  } catch (err) {
    console.error('스크립트 실행 중 오류 발생:', err);
  }
}

fetchPublicData();
