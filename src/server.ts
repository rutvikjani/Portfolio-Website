// src/server.ts — Groq version
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Groq from 'groq-sdk';
import { retrieve, buildContext } from './rag.js';
import 'dotenv/config';

// ── Config ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error('❌  Missing GROQ_API_KEY in environment. Add it to .env');
  process.exit(1);
}

const groq = new Groq({ apiKey: GROQ_API_KEY });

// ── System prompt ─────────────────────────────────────────────────────────────
const BASE_SYSTEM = `You are a helpful, friendly AI assistant embedded in Rutvik Jani's personal portfolio website. Your sole purpose is to help visitors learn about Rutvik — his skills, experience, projects, education, and availability.

IMPORTANT: You MUST answer using ONLY the CONTEXT chunks provided. The context contains everything about Rutvik. Do not say "not mentioned" or "no specific information" if the context has relevant content — read it carefully before responding.

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
- When asked about AI experience, projects, or what Rutvik has built — look in the projects and skills_ai_llm context chunks for the answer.`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN ?? '*',
  methods: ['POST', 'GET', 'OPTIONS'],
}));
app.use(express.json({ limit: '16kb' }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests — please wait a moment and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'rutvik-rag-chatbot', provider: 'groq' });
});

// ── Chat endpoint ─────────────────────────────────────────────────────────────
app.post('/api/chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, history = [] } = req.body as ChatRequest;

    // Validate
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'message is required' });
      return;
    }
    if (message.length > 500) {
      res.status(400).json({ error: 'Message too long (max 500 chars)' });
      return;
    }
    if (history.length > 10) {
      res.status(400).json({ error: 'History too long (max 10 messages)' });
      return;
    }

    // ── RAG: retrieve relevant chunks ─────────────────────────────────────────
    const recentHistory = history.slice(-4).map(m => m.content).join(' ');
    const retrievalQuery = `${recentHistory} ${message}`;
    const retrieved = retrieve(retrievalQuery, 4);
    const context = buildContext(retrieved);

    console.log(`[RAG] Query: "${message.slice(0, 60)}…"`);
    console.log(`[RAG] Retrieved: ${retrieved.map(r => r.chunk.id).join(', ')}`);

    // ── Build prompt ──────────────────────────────────────────────────────────
    const systemPrompt = `${BASE_SYSTEM}

--- CONTEXT (retrieved from Rutvik's knowledge base) ---
${context}
--- END CONTEXT ---`;

    // Sanitise history
    const safeHistory: ChatMessage[] = history
      .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-8);

    // Groq uses OpenAI-compatible format — system message goes in messages array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...safeHistory,
      { role: 'user', content: message },
    ];

    // ── Call Groq ─────────────────────────────────────────────────────────────
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', // fast, free, great for chatbots
      max_tokens: 300,
      temperature: 0.7,
      messages,
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    console.log(`[RAG] Reply: "${reply.slice(0, 80)}…"`);

    res.json({
      reply,
      chunks_used: retrieved.map(r => r.chunk.id),
    });

  } catch (err) {
    next(err);
  }
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  Rutvik RAG chatbot (Groq) running on http://localhost:${PORT}`);
  console.log(`    POST http://localhost:${PORT}/api/chat`);
  console.log(`    GET  http://localhost:${PORT}/api/health\n`);
});
