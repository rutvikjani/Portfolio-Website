// src/worker.ts — Cloudflare Workers entry point
// Replaces Express server entirely — uses native fetch/Response API
import { retrieve, buildContext } from './rag';

// ── Environment interface (secrets set via wrangler) ──────────────────────────
export interface Env {
  GROQ_API_KEY: string;
  FRONTEND_ORIGIN?: string;
}

// ── System prompt ─────────────────────────────────────────────────────────────
const BASE_SYSTEM = `You are a helpful, friendly AI assistant embedded in Rutvik Jani's personal portfolio website. Your sole purpose is to help visitors learn about Rutvik — his skills, experience, projects, education, and availability.

IMPORTANT: You MUST answer using ONLY the CONTEXT chunks provided. Read ALL context chunks carefully before responding.

RULES:
- Read ALL context chunks carefully before answering.
- Answer questions about Rutvik using the context provided.
- If genuinely not in the context, say "I don't have that detail, but reach Rutvik at rutvikjani22@gmail.com".
- Keep answers concise — 2-4 sentences unless more detail is needed.
- Be warm and professional. You represent Rutvik positively.
- Never make up facts not in the context.
- If asked something unrelated to Rutvik, say "I'm only set up to answer questions about Rutvik and his work!"
- Use **bold** for key technology names or project titles.
- Do not repeat the question back.
- When asked about AI experience or projects — look in the projects and skills_ai_llm context chunks.`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

// ── CORS headers helper ───────────────────────────────────────────────────────
function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ── Rate limiting (simple in-memory, resets per Worker instance) ──────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

// ── Main Worker handler ───────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = env.FRONTEND_ORIGIN ?? '*';
    const cors = corsHeaders(origin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Health check
    if (request.method === 'GET' && url.pathname === '/api/health') {
      return Response.json(
        { status: 'ok', service: 'rutvik-rag-chatbot', provider: 'groq', runtime: 'cloudflare-workers' },
        { headers: cors }
      );
    }

    // Chat endpoint
    if (request.method === 'POST' && url.pathname === '/api/chat') {
      // Rate limit by IP
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
      if (!checkRateLimit(ip)) {
        return Response.json(
          { error: 'Too many requests — please wait a moment.' },
          { status: 429, headers: cors }
        );
      }

      // Parse body
      let body: ChatRequest;
      try {
        body = await request.json() as ChatRequest;
      } catch {
        return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: cors });
      }

      const { message, history = [] } = body;

      // Validate
      if (!message || typeof message !== 'string') {
        return Response.json({ error: 'message is required' }, { status: 400, headers: cors });
      }
      if (message.length > 500) {
        return Response.json({ error: 'Message too long (max 500 chars)' }, { status: 400, headers: cors });
      }
      if (history.length > 10) {
        return Response.json({ error: 'History too long (max 10 messages)' }, { status: 400, headers: cors });
      }

      // RAG retrieval
      const recentHistory = history.slice(-4).map(m => m.content).join(' ');
      const retrievalQuery = `${recentHistory} ${message}`;
      const retrieved = retrieve(retrievalQuery, 4);
      const context = buildContext(retrieved);

      console.log(`[RAG] Query: "${message.slice(0, 60)}"`);
      console.log(`[RAG] Retrieved: ${retrieved.map(r => r.chunk.id).join(', ')}`);

      // Build messages for Groq
      const systemPrompt = `${BASE_SYSTEM}\n\n--- CONTEXT ---\n${context}\n--- END CONTEXT ---`;

      const safeHistory = history
        .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-8);

      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...safeHistory,
        { role: 'user', content: message },
      ];

      // Call Groq
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            max_tokens: 300,
            temperature: 0.7,
            messages,
          }),
        });

        if (!groqRes.ok) {
          const err = await groqRes.json() as { error?: { message?: string } };
          console.error('[Groq Error]', groqRes.status, err);
          return Response.json(
            { error: err.error?.message ?? `Groq error ${groqRes.status}` },
            { status: 502, headers: cors }
          );
        }

        const data = await groqRes.json() as {
          choices: Array<{ message: { content: string } }>;
        };
        const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

        console.log(`[RAG] Reply: "${reply.slice(0, 80)}"`);

        return Response.json(
          { reply, chunks_used: retrieved.map(r => r.chunk.id) },
          { headers: cors }
        );

      } catch (err) {
        console.error('[Worker Error]', err);
        return Response.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500, headers: cors }
        );
      }
    }

    // 404 for anything else
    return Response.json({ error: 'Not found' }, { status: 404, headers: cors });
  },
};
