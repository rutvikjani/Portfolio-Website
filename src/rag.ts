// src/rag.ts — works in Cloudflare Workers (no Node.js dependencies)
import { knowledgeChunks, type KnowledgeChunk } from '../knowledge/rutvik';

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  score: number;
}

// ── Tokenise ──────────────────────────────────────────────────────────────────
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

// ── Build IDF from corpus ─────────────────────────────────────────────────────
const corpusTokenCounts = new Map<string, number>();
for (const chunk of knowledgeChunks) {
  const tokens = new Set(tokenise(chunk.text + ' ' + chunk.category + ' ' + chunk.id));
  for (const t of tokens) {
    corpusTokenCounts.set(t, (corpusTokenCounts.get(t) ?? 0) + 1);
  }
}
const N = knowledgeChunks.length;

function idf(token: string): number {
  const df = corpusTokenCounts.get(token) ?? 0;
  return df > 0 ? Math.log((N + 1) / (df + 1)) + 1 : 1;
}

function scoreTFIDF(query: string, chunk: KnowledgeChunk): number {
  const qTokens = tokenise(query);
  const chunkText = (chunk.text + ' ' + chunk.category + ' ' + chunk.id).toLowerCase();
  const chunkTokens = tokenise(chunkText);
  const chunkFreq = new Map<string, number>();
  for (const t of chunkTokens) chunkFreq.set(t, (chunkFreq.get(t) ?? 0) + 1);
  let score = 0;
  for (const qt of qTokens) {
    const tf = (chunkFreq.get(qt) ?? 0) / (chunkTokens.length || 1);
    score += tf * idf(qt);
  }
  return score;
}

// ── Category + ID boosts ──────────────────────────────────────────────────────
const CATEGORY_BOOSTS: Record<string, string[]> = {
  skills:            ['skills', 'know', 'technology', 'stack', 'language', 'framework', 'tool'],
  skills_ai_llm:     ['ai', 'llm', 'gpt', 'llama', 'rag', 'chatbot', 'voice', 'ml', 'machine learning', 'nlp', 'faiss', 'vector'],
  skills_backend:    ['backend', 'api', 'server', 'node', 'nest', 'express', 'fastapi'],
  skills_frontend:   ['frontend', 'react', 'ui', 'web', 'javascript', 'typescript'],
  skills_database:   ['database', 'sql', 'mongo', 'postgres', 'redis'],
  experience:        ['work', 'job', 'company', 'employer', 'role', 'career', 'worked'],
  projects:          ['project', 'built', 'developed', 'created', 'made', 'chatbot', 'voice', 'face', 'erp', 'crm', 'vms'],
  education:         ['study', 'degree', 'university', 'college', 'msc', 'bachelor', 'heriot'],
  availability:      ['hire', 'available', 'open', 'looking', 'opportunity', 'freelance', 'contact'],
  personal:          ['who', 'about', 'rutvik', 'contact', 'email', 'phone'],
  certifications:    ['certification', 'certified', 'course', 'coursera', 'intellipaat'],
  value_proposition: ['why hire', 'strength', 'good at', 'recommend', 'best'],
};

const ID_BOOSTS: Array<{ keywords: string[]; ids: string[] }> = [
  {
    keywords: ['ai', 'llm', 'gpt', 'chatbot', 'voice', 'rag', 'machine learning', 'ml', 'nlp', 'face recognition', 'faiss'],
    ids: ['skills_ai_llm', 'project_voice', 'project_ai_vms', 'project_face', 'skills_ml'],
  },
  {
    keywords: ['project', 'built', 'made', 'developed', 'erp', 'crm', 'asset', 'vms', 'video'],
    ids: ['project_erp_crm', 'project_asset_rbac', 'project_ai_vms', 'project_voice', 'project_face'],
  },
  {
    keywords: ['backend', 'api', 'node', 'nest', 'express', 'server'],
    ids: ['skills_backend', 'experience_adiance', 'experience_vmukti'],
  },
  {
    keywords: ['full stack', 'fullstack', 'mern', 'react', 'frontend'],
    ids: ['skills_frontend', 'skills_backend', 'experience_vmukti'],
  },
];

function idBoost(query: string, chunk: KnowledgeChunk): number {
  const q = query.toLowerCase();
  let boost = 0;
  for (const rule of ID_BOOSTS) {
    if (rule.ids.includes(chunk.id)) {
      for (const kw of rule.keywords) {
        if (q.includes(kw)) { boost = Math.max(boost, 0.5); break; }
      }
    }
  }
  return boost;
}

function categoryBoost(query: string, chunk: KnowledgeChunk): number {
  const q = query.toLowerCase();
  const boosts = CATEGORY_BOOSTS[chunk.category] ?? [];
  for (const keyword of boosts) { if (q.includes(keyword)) return 0.3; }
  const idBoosts = CATEGORY_BOOSTS[chunk.id] ?? [];
  for (const keyword of idBoosts) { if (q.includes(keyword)) return 0.4; }
  return 0;
}

// ── Public API ────────────────────────────────────────────────────────────────
export function retrieve(query: string, topK = 4): RetrievedChunk[] {
  const scored = knowledgeChunks.map(chunk => ({
    chunk,
    score: scoreTFIDF(query, chunk) + categoryBoost(query, chunk) + idBoost(query, chunk),
  }));
  scored.sort((a, b) => b.score - a.score);
  const results = scored.slice(0, topK);
  const hasIdentity = results.some(r => r.chunk.id === 'identity');
  if (!hasIdentity) results[topK - 1] = scored.find(r => r.chunk.id === 'identity')!;
  return results;
}

export function buildContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map(({ chunk }) => `[${chunk.category.toUpperCase()} — ${chunk.id}]\n${chunk.text}`)
    .join('\n\n');
}
