import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Store in .env.local
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",  // Llama3-8B model
      messages: [{ role: "user", content: message }],
    });

    return Response.json({ reply: response.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
