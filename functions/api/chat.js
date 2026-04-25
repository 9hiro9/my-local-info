export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const { message } = await request.json();
    
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch search-index.json
    const url = new URL(request.url).origin + "/data/search-index.json";
    const res = await fetch(url);
    const searchIndex = await res.json();

    // 2. Keyword matching
    const keywords = message.split(/\s+/).filter(k => k.length > 1);
    const scoredItems = searchIndex.map(item => {
      let score = 0;
      const searchText = `${item.title} ${item.summary} ${item.content}`;
      keywords.forEach(kw => {
        if (searchText.includes(kw)) {
          score += 2; // Exact match in title/content
        }
      });
      return { ...item, score };
    });

    const topItems = scoredItems
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const contextData = topItems
      .map(item => `- ${item.title}: ${item.summary}`)
      .join('\n');

    // 3. System Prompt
    const systemPrompt = `You are a very concise AI assistant for a Korean local information blog.
Answer ONLY in Korean. 
MAXIMUM 2 short sentences. Be extremely brief and direct.
Do NOT use any introductory or closing remarks (e.g., "안녕하세요", "도움이 되길 바랍니다").
Do NOT use any markdown symbols (**, *, #, -). Plain text only.
Base your answer ONLY on the following blog data. If not relevant, reply: 해당 내용은 블로그에서 확인이 어렵습니다. 다른 질문을 해주세요.

[블로그 데이터]
${contextData || "검색된 데이터가 없습니다."}`;

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
    });

    // 4. Strip Markdown from AI response
    const stripMarkdown = (text) => {
      if (!text) return "";
      return text
        .replace(/#+/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/-/g, '')
        .replace(/`|\[|\]|\(|\)/g, '')
        .trim();
    };

    let finalResponse = aiResponse;
    if (finalResponse.response) {
      finalResponse.response = stripMarkdown(finalResponse.response);
    } else if (finalResponse.result?.response) {
      finalResponse.result.response = stripMarkdown(finalResponse.result.response);
    }

    return new Response(JSON.stringify(finalResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
