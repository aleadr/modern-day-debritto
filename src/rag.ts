import type { Env } from "./llm";
import { getEmbedding } from "./llm";

export interface MemoryItem {
    id: string;
    text: string;
    type: string;
    embedding: number[]; // should be filled for real use
}

export function cosineSimilarity(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveTopK(
    env: Env,
    query: string,
    memories: MemoryItem[],
    k: number
): Promise<MemoryItem[]> {
    const qEmb = await getEmbedding(env, query);

    const scored = memories
        .filter(m => Array.isArray(m.embedding) && m.embedding.length > 0)
        .map(m => ({
            item: m,
            score: cosineSimilarity(qEmb, m.embedding)
        }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, k).map(s => s.item);
}
