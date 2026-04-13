# Rutvik Jani — Portfolio + RAG Chatbot

Personal portfolio website with an AI-powered chatbot built on a RAG (Retrieval-Augmented Generation) pipeline. The chatbot answers visitor questions about Rutvik's skills, experience, and projects using Groq (Llama 3.1) as the LLM.

---

## Project Structure

```
portfolio/
├── rutvik-portfolio.html          # Frontend — single HTML file
└── rutvik-rag-backend/
    └── rutvik-rag/
        ├── src/
        │   ├── server.ts          # Express API server (Groq)
        │   ├── rag.ts             # RAG retrieval engine (TF-IDF)
        │   └── test-rag.ts        # Test retrieval without API
        ├── knowledge/
        │   └── rutvik.ts          # Resume knowledge base (chunks)
        ├── .env.example           # Environment variable template
        ├── package.json
        ├── tsconfig.json
        └── README.md
```

---

## Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | HTML, CSS, JavaScript, Three.js |
| Backend | Node.js, Express, TypeScript |
| AI / LLM | Groq API (llama-3.1-8b-instant) |
| RAG Engine | Custom TF-IDF retrieval (no vector DB needed) |
| Hosting Frontend | Netlify |
| Hosting Backend | Render |

---

## Local Development

### Prerequisites
- Node.js 22.x LTS
- A free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

### 2. Install backend dependencies
```bash
cd rutvik-rag-backend/rutvik-rag
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Open `.env` and add your Groq key:
```
GROQ_API_KEY=gsk_your_key_here
PORT=3001
FRONTEND_ORIGIN=*
```

### 4. Run the backend
```bash
npm run dev
```

You should see:
```
✅  Rutvik RAG chatbot (Groq) running on http://localhost:3001
```

### 5. Open the frontend
Just open `rutvik-portfolio.html` in your browser — the chatbot connects to `localhost:3001` automatically.

---

## Deployment

### Frontend → Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop `rutvik-portfolio.html` onto the Netlify dashboard
3. Your site is live at `your-name.netlify.app`

### Backend → Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set the root directory to `rutvik-rag-backend/rutvik-rag`
5. Set build command:
   ```
   npm install && npm run build
   ```
6. Set start command:
   ```
   npm start
   ```
7. Add environment variable:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_your_key_here`
8. Deploy — Render gives you a URL like `https://rutvik-rag.onrender.com`

### Connect frontend to backend

Once your backend is live on Render, open `rutvik-portfolio.html` in a text editor, find this line:

```js
const CHAT_API = 'http://localhost:3001';
```

Change it to your Render URL:

```js
const CHAT_API = 'https://rutvik-rag.onrender.com';
```

Re-upload to Netlify — done! ✅

---

## Updating the Chatbot Knowledge

All of Rutvik's information lives in one file:

```
knowledge/rutvik.ts
```

Each chunk looks like this:

```ts
{
  id: 'project_voice',
  category: 'projects',
  text: `Rutvik built an AI Voice Support System using Python, Llama, RAG, and WebRTC...`,
}
```

To add a new project, job, or skill — just add a new chunk to the array. The RAG engine picks it up automatically, no retraining needed.

---

## API Reference

### POST /api/chat

Request:
```json
{
  "message": "What are Rutvik's skills?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ]
}
```

Response:
```json
{
  "reply": "Rutvik has strong skills in...",
  "chunks_used": ["skills_backend", "skills_ai_llm", "identity"]
}
```

### GET /api/health

```json
{ "status": "ok", "service": "rutvik-rag-chatbot", "provider": "groq" }
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key from console.groq.com |
| `PORT` | No | Port to run the server (default: 3001) |
| `FRONTEND_ORIGIN` | No | CORS origin (default: `*`, set to your Netlify URL in production) |

---

## Contact

**Rutvik Jani**
- Email: rutvikjani22@gmail.com
- LinkedIn: [linkedin.com/in/rutvik-jani-042956227](https://www.linkedin.com/in/rutvik-jani-042956227/)
- GitHub: [github.com/rutvikjani](https://github.com/rutvikjani)