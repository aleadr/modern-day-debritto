export interface Env {
    AI: Ai;  // Native Workers AI binding
    ADMIN_KEY?: string;  // Optional admin key for unlimited access
    RATE_LIMIT?: KVNamespace;  // KV store for rate limiting
}

interface Ai {
    run(model: string, inputs: any): Promise<any>;
}

const CHAT_MODEL = "@cf/meta/llama-3-8b-instruct";        // adjust to actual model slug if needed
const EMBED_MODEL = "@cf/baai/bge-small-en-v1.5";         // embedding model slug

export async function getEmbedding(env: Env, text: string): Promise<number[]> {
    const result: any = await env.AI.run(EMBED_MODEL, {
        text
    });

    // Adjust based on actual Workers AI embedding response format.
    // Often it's something like: { data: [ [ ...numbers ] ] }
    const vector =
        (result && result.data && result.data[0]) ||
        result.vector ||
        result[0];

    return vector as number[];
}

export async function callChatLlm(
    env: Env,
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    const result: any = await env.AI.run(CHAT_MODEL, {
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]
    });

    // Workers AI usually returns { response: "..." } for text models.
    if (typeof result === "string") return result;
    if (result && typeof result.response === "string") return result.response;
    return JSON.stringify(result);
}
