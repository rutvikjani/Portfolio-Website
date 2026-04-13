# Rutvik RAG Chatbot — Cloudflare Workers

RAG-powered chatbot backend running on **Cloudflare Workers** (free, no card, no sleep, global edge network).

## Why RAG?

This is a simple portfolio website — a basic hardcoded chatbot would have worked fine. But I deliberately built a full RAG pipeline to showcase skills in:

- **Retrieval-Augmented Generation (RAG)** — chunking knowledge, TF-IDF scoring, context injection
- **LLM integration** — connecting Groq (Llama 3.1) via API
- **Backend engineering** — serverless Workers, rate limiting, CORS, error handling
- **AI system design** — retrieval quality, prompt engineering, response accuracy

---

## Setup

### 1. Install dependencies
```powershell
npm install
```

### 2. Login to Cloudflare
```powershell
npx wrangler login
```
This opens a browser — log in with your free Cloudflare account.

### 3. Set your Groq API key as a secret
```powershell
npx wrangler secret put GROQ_API_KEY
```
Paste your key when prompted: `gsk_...`

### 4. Deploy
```powershell
npm run deploy
```

You'll get a live URL like:
```
https://rutvik-rag.YOUR-SUBDOMAIN.workers.dev
```

---

## Local Development

Create a `.dev.vars` file (git ignored):
```
GROQ_API_KEY=gsk_your_key_here
```

Then run:
```powershell
npm run dev
```

Server runs at `http://localhost:8787`

---

## Connect to Frontend

In `rutvik-portfolio.html`, update:
```js
const CHAT_API = 'https://rutvik-rag.YOUR-SUBDOMAIN.workers.dev';
```

---

## API

### POST /api/chat
```json
{ "message": "What are Rutvik's skills?", "history": [] }
```

### GET /api/health
```json
{ "status": "ok", "provider": "groq", "runtime": "cloudflare-workers" }
```

---

## Updating Knowledge

Edit `knowledge/rutvik.ts` — add new chunks for new projects or jobs. Redeploy with `npm run deploy`.

---

## Files

| File | Purpose |
|------|---------|
| `src/worker.ts` | Main Worker handler (replaces Express) |
| `src/rag.ts` | TF-IDF RAG retrieval engine |
| `knowledge/rutvik.ts` | Resume knowledge base |
| `wrangler.toml` | Cloudflare Workers config |
