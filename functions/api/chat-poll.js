export async function onRequestGet(context) {
  const { env, request } = context;
  
  try {
    const url = new URL(request.url);
    const senderFilter = url.searchParams.get('sender');

    // KV에서 모든 키 목록 가져오기 (접두사 'msg_' 사용)
    const list = await env.CHAT_KV.list({ prefix: 'msg_' });
    
    // 각 키의 실제 값을 가져오기
    const messages = await Promise.all(
      list.keys.map(async (key) => {
        const val = await env.CHAT_KV.get(key.name);
        return JSON.parse(val);
      })
    );

    // 시간순 정렬
    let sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);

    // 발신자 필터링 (있는 경우)
    if (senderFilter) {
      sortedMessages = sortedMessages.filter(m => m.sender === senderFilter);
    }

    return new Response(JSON.stringify(sortedMessages), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
