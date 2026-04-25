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

    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are an AI assistant for a Korean local information blog. Answer in Korean.' },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
    });

    return new Response(JSON.stringify(aiResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
