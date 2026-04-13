// src/test-rag.ts
// Run with: npm run test:rag
// Tests the RAG retrieval without calling Claude API

import { retrieve, buildContext } from './rag.js';

const testQueries = [
  'What are Rutvik\'s skills?',
  'Tell me about his LLM experience',
  'Where did he work?',
  'What projects has he built?',
  'Is he available for hire?',
  'What certifications does he have?',
  'Tell me about his education',
  'What is the AI voice system project?',
  'Does he know Python?',
  'How can I contact him?',
];

console.log('═══════════════════════════════════════════════════════════');
console.log('  RUTVIK RAG — Retrieval Test');
console.log('═══════════════════════════════════════════════════════════\n');

for (const query of testQueries) {
  const results = retrieve(query, 3);
  console.log(`Query: "${query}"`);
  console.log(`Retrieved: ${results.map(r => `${r.chunk.id}(${r.score.toFixed(3)})`).join(', ')}`);
  console.log('Context preview:', buildContext(results).slice(0, 120) + '…\n');
}

console.log('✅  RAG retrieval test complete');
