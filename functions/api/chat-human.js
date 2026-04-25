export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const { message, sender } = await request.json();
    
    if (!message || !sender) {
      return new Response(JSON.stringify({ error: "Message and sender are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const timestamp = Date.now();
    const key = `msg_${timestamp}`;
    const value = JSON.stringify({ 
      id: timestamp, // ID로 사용하기 위해 추가
      message, 
      sender, 
      timestamp 
    });

    await env.CHAT_KV.put(key, value);

    return new Response(JSON.stringify({ success: true, key }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
