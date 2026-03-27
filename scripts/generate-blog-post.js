const fs = require('fs');
const path = require('path');

async function generateBlogPost() {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('환경변수(GEMINI_API_KEY)가 설정되지 않았습니다.');
      return;
    }

    const DATA_PATH = path.join(__dirname, '../public/data/local-info.json');
    const POSTS_DIR = path.join(__dirname, '../src/content/posts');

    let localData;
    try {
      localData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch (err) {
      console.error('기존 데이터를 읽는 중 오류 발생:', err);
      return;
    }

    // [1단계] 최신 데이터 확인
    // festivals와 benefits 중 가장 마지막에 추가된 항목 찾기
    const allItems = [...(localData.festivals || []), ...(localData.benefits || [])];
    if (allItems.length === 0) {
      console.log('데이터가 없습니다.');
      return;
    }

    // 마지막 항목 (배열의 가장 뒤)
    // fetch-public-data.js가 push로 추가하므로 마지막 항목이 가장 최신임
    const latestItem = allItems[allItems.length - 1];
    const itemName = latestItem.title || latestItem.name;

    // 기존 파일들과 비교 (name 기준 중복 확인)
    const existingFiles = fs.readdirSync(POSTS_DIR);
    let isAlreadyExists = false;
    for (const file of existingFiles) {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      // 제목이 title: (이름) 형식으로 들어있으므로 간단히 체크
      if (content.includes(itemName)) {
        isAlreadyExists = true;
        break;
      }
    }

    if (isAlreadyExists) {
      console.log('이미 작성된 글입니다');
      return;
    }

    // [2단계] Gemini AI로 블로그 글 생성
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // 오늘 날짜
    const today = new Date().toISOString().split('T')[0];

    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const json = await response.json();
    let aiResponse = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      console.error('Gemini 응답을 받지 못했습니다. 전체 응답:', JSON.stringify(json, null, 2));
      return;
    }

    // FILENAME 추출
    const filenameMatch = aiResponse.match(/FILENAME:\s*(.+)$/m);
    let filename = `${today}-post.md`;
    let postContent = aiResponse;

    if (filenameMatch) {
      filename = filenameMatch[1].trim();
      if (!filename.endsWith('.md')) filename += '.md';
      // FILENAME 줄 제거
      postContent = aiResponse.replace(filenameMatch[0], '').trim();
    }

    // 마크다운 코드 블록(```) 제거
    postContent = postContent.replace(/```markdown|```/g, '').trim();

    // [3단계] 파일 저장
    const finalPath = path.join(POSTS_DIR, filename);
    fs.writeFileSync(finalPath, postContent, 'utf8');

    console.log(`생성 완료: ${filename}`);

  } catch (err) {
    console.error('스크립트 실행 중 오류 발생:', err);
  }
}

generateBlogPost();
