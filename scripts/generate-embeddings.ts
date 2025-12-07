/**
 * Script to generate embeddings for all persona memory items
 * Run this locally with: npx wrangler dev --local --test-scheduled
 * Or as a one-time worker execution
 */

import personaVectors from "../src/persona_vectors.json";
import { getEmbedding, type Env } from "../src/llm";
import type { MemoryItem } from "../src/rag";

interface ExtendedEnv extends Env {
    // Add any additional environment variables if needed
}

/**
 * Generate embeddings for all memory items
 */
export async function generateAllEmbeddings(env: Env): Promise<MemoryItem[]> {
    const memories = personaVectors as unknown as MemoryItem[];
    const updatedMemories: MemoryItem[] = [];

    console.log(`Starting embedding generation for ${memories.length} memory items...`);

    for (let i = 0; i < memories.length; i++) {
        const memory = memories[i];
        console.log(`[${i + 1}/${memories.length}] Processing: ${memory.id}`);

        try {
            // Generate embedding for this memory item's text
            const embedding = await getEmbedding(env, memory.text);

            updatedMemories.push({
                ...memory,
                embedding: embedding
            });

            console.log(`  ✓ Generated ${embedding.length}-dimensional embedding`);

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error(`  ✗ Failed to generate embedding for ${memory.id}:`, error);
            // Keep the original (empty) embedding on failure
            updatedMemories.push(memory);
        }
    }

    return updatedMemories;
}

/**
 * Cloudflare Worker handler for embedding generation
 * This can be deployed as a separate worker or run locally
 */
export default {
    async fetch(request: Request, env: ExtendedEnv): Promise<Response> {
        if (request.method !== "POST") {
            return new Response("Send POST to trigger embedding generation", {
                status: 405,
                headers: { "Content-Type": "text/plain" }
            });
        }

        try {
            console.log("Starting embedding generation process...");
            const updatedMemories = await generateAllEmbeddings(env);

            // Return the updated JSON
            const jsonOutput = JSON.stringify(updatedMemories, null, 4);

            return new Response(jsonOutput, {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Disposition": "attachment; filename=persona_vectors_updated.json"
                }
            });
        } catch (error) {
            console.error("Error during embedding generation:", error);
            return new Response(
                JSON.stringify({
                    error: "Failed to generate embeddings",
                    message: error instanceof Error ? error.message : String(error)
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }
    }
};
