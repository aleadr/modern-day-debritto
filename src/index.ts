import persona from "./persona.json";
import personaVectors from "./persona_vectors.json";
import { callChatLlm, type Env } from "./llm";
import { retrieveTopK, type MemoryItem } from "./rag";

interface RequestBody {
    mode: "chat" | "choice";
    message: string;
    options?: string[]; // used in choice mode
    session_id?: string; // for conversation continuity
}

interface ConversationHistory {
    messages: Array<{ role: "user" | "assistant", content: string }>;
    created: number;
}

const SESSION_TTL = 1800; // 30 minutes in seconds
const MAX_HISTORY = 10; // max messages to keep

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return corsResponse(new Response(null, { status: 204 }));
        }

        // Rate limiting (20 requests per minute per IP for public)
        // Admin bypass: Add header "X-Admin-Key: your-secret-key"
        const adminKey = env.ADMIN_KEY; // Set in wrangler.toml or Cloudflare dashboard
        const requestAdminKey = request.headers.get("X-Admin-Key");
        const isAdmin = adminKey && requestAdminKey === adminKey;

        if (!isAdmin && request.method === "POST") {
            const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
            const rateLimitKey = `ratelimit:${clientIP}`;

            // Check rate limit (20 requests per 60 seconds)
            const rateLimitData = await env.RATE_LIMIT?.get(rateLimitKey);
            if (rateLimitData) {
                const { count, timestamp } = JSON.parse(rateLimitData);
                const now = Date.now();
                const elapsed = now - timestamp;

                if (elapsed < 60000) { // Within 60 seconds
                    if (count >= 20) {
                        return corsResponse(jsonResponse({
                            type: "error",
                            error: "Rate limit exceeded",
                            message: "Limit: 20 requests per minute. Please wait before trying again. For unlimited access, run locally (code is open source)."
                        }, 429));
                    }
                    // Increment count
                    await env.RATE_LIMIT?.put(rateLimitKey, JSON.stringify({ count: count + 1, timestamp }), { expirationTtl: 60 });
                } else {
                    // Reset window
                    await env.RATE_LIMIT?.put(rateLimitKey, JSON.stringify({ count: 1, timestamp: now }), { expirationTtl: 60 });
                }
            } else {
                // First request
                await env.RATE_LIMIT?.put(rateLimitKey, JSON.stringify({ count: 1, timestamp: Date.now() }), { expirationTtl: 60 });
            }
        }

        // Health check endpoint
        if (request.method === "GET") {
            return corsResponse(jsonResponse({
                status: "healthy",
                persona: persona.name,
                modes: ["chat", "choice"],
                version: "0.1.0"
            }));
        }

        if (request.method !== "POST") {
            return corsResponse(new Response("Use POST for queries, GET for health check", { status: 405 }));
        }

        let body: RequestBody;
        try {
            body = await request.json();
        } catch {
            return new Response("Invalid JSON", { status: 400 });
        }

        const mode = body.mode;
        const message = body.message;
        const options = body.options || [];
        const sessionId = body.session_id || crypto.randomUUID();

        if (!mode || !message) {
            return new Response("Missing mode or message", { status: 400 });
        }

        // Get or create session history
        let history: ConversationHistory = { messages: [], created: Date.now() };
        if (body.session_id && env.RATE_LIMIT) {
            const sessionKey = `session:${body.session_id}`;
            const stored = await env.RATE_LIMIT.get(sessionKey);
            if (stored) {
                history = JSON.parse(stored);
            }
        }

        const memories = personaVectors as unknown as MemoryItem[];

        let topMemories: MemoryItem[] = [];
        try {
            topMemories = await retrieveTopK(env, message, memories, 3);
        } catch (error) {
            console.error("RAG retrieval failed:", error);
            // Continue without memories if RAG fails
        }

        const systemPrompt = buildSystemPrompt(
            persona as any,
            topMemories,
            mode,
            history.messages // Pass history to prompt builder
        );
        const userPrompt = buildUserPrompt(message, options, mode);

        let raw: string;
        try {
            raw = await callChatLlm(env, systemPrompt, userPrompt);
        } catch (error) {
            console.error("LLM call failed:", error);
            return corsResponse(jsonResponse({
                type: "error",
                error: "AI service unavailable",
                message: error instanceof Error ? error.message : "Unknown error"
            }), 503);
        }

        // Update session history (keep last MAX_HISTORY messages)
        history.messages.push({ role: "user", content: message });
        history.messages.push({ role: "assistant", content: raw });
        if (history.messages.length > MAX_HISTORY) {
            history.messages = history.messages.slice(-MAX_HISTORY);
        }

        // Save session to KV with TTL
        if (env.RATE_LIMIT) {
            const sessionKey = `session:${sessionId}`;
            await env.RATE_LIMIT.put(sessionKey, JSON.stringify(history), { expirationTtl: SESSION_TTL });
        }

        if (mode === "choice") {
            const parsed = safeParseChoice(raw);
            return corsResponse(jsonResponse({ ...parsed, session_id: sessionId }));
        } else {
            return corsResponse(jsonResponse({
                type: "chat",
                answer: raw,
                session_id: sessionId
            }));
        }
    }
};

function buildSystemPrompt(
    persona: any,
    memories: MemoryItem[],
    mode: "chat" | "choice",
    conversationHistory: Array<{ role: "user" | "assistant", content: string }> = []
): string {
    const name = persona.name;
    const mbti = persona.mbti;
    const iq = persona.iq;
    const shortProfile = persona.short_profile;
    const education = persona.education;

    const memText = memories
        .map((m, i) => `[${i + 1}] ${m.text}`)
        .join("\n");

    // Build education summary
    const educationText = education ? `
Education & Intellectual Formation:
- ${education.highest_level}
- Fields: ${education.field}
- Strengths: ${education.strengths.join(", ")}` : "";

    // Build conversation history text
    const historyText = conversationHistory.length > 0
        ? `\n=== CURRENT CONVERSATION (Remember this context!) ===\n${conversationHistory.map(m =>
            `${m.role === "user" ? "User" : "You"}: ${m.content}`
        ).join("\n")}\n=== END CONVERSATION HISTORY ===\n`
        : "";

    const base = `
You are a character/persona modeled after ${name}, built from historical records and psychological analysis.
You understand that you are not literally the historical person, but a simulation designed to think and respond as he would have.

Character Profile:
MBTI: ${mbti}
Estimated IQ: ${iq} (high verbal-analytic intelligence, exceptional linguistic ability)
${shortProfile}
${educationText}

Historical Memory Snippets:
${memText}
${historyText}

Guidelines:
- **REMEMBER CONVERSATION**: If there's conversation history above, remember what the user told you (their name, previous topics, etc.)
- **Warm & Personal**: Speak with genuine warmth and care, like a spiritual friend
- **Voice**: Pastor paroki muda - formal tapi bisa bicara sehari-hari. Bukan khotbah, tapi obrolan ringan dengan sentuhan spiritual
- **Tone**: Gentle, approachable, joyful. Like chatting with a friendly young priest at the parish office
- **Spiritual Touch**: Light touch only - don't over-spiritualize every topic. Can discuss everyday matters naturally, with gentle spiritual wisdom when appropriate
- **Length**: MAXIMUM 2 paragraphs (80-120 words). Brief, natural, complete.
- **NEVER mention missionary background**: Don't say "Sebagai misionaris...", "Di India saya...", etc. ONLY if user directly asks about your life/history
- **Focus**: Answer the actual question naturally. Not every answer needs to be deeply theological.

GOOD EXAMPLE:
Q: "Saya lapar"
A: "Ah, lapar ya? Semoga saudara segera bisa makan yang enak! Makan bersama keluarga atau teman selalu istimewa - kasih Tuhan sering hadir dalam momen sederhana seperti itu."

BAD EXAMPLE (too preachy):
"Saudara, sebagai misionaris yang pernah mengalami kelaparan di India, saya percaya lapar adalah pengingat bahwa..."

- **Don't force Portuguese quotes**: Almost never use them unless specifically asked about historical quotes.
- Use only the profile and memory snippets as factual knowledge
- If asked about information not in your memory, say simply: "Maaf, itu tidak ada dalam memori saya"
- You may briefly acknowledge being a simulation if directly asked, but don't dwell on it

CRITICAL: You MUST respond in Bahasa Indonesia (Indonesian language).
All your answers should be in Indonesian, not English or Portuguese (except for his historical quotes which may remain in original Portuguese).

IMPORTANT: Always use gender-neutral terms when addressing people:
- Use "saudara" (singular) or "saudara-saudara" (plural) to address people
- Do NOT use gendered terms like "saudari" (sister), "kakak" (older sibling), "adik" (younger sibling), "bapak" (father/sir), or "ibu" (mother/madam)
- Examples: "Saudara, saya memahami..." or "Saudara-saudara yang terkasih..."
`.trim();

    const modeInstruction =
        mode === "chat"
            ? "Task: Answer the user's message as this character would, in natural Bahasa Indonesia. Be thoughtful and authentic to the character's documented personality."
            : `Task: The user describes a situation and options. Choose exactly one option that this character would most likely take, based on his documented values and behavior patterns.
Return valid JSON only (the 'reason' field must be in Bahasa Indonesia):
{"choice":"A","reason":"penjelasan singkat berdasarkan nilai dan kepribadian karakter ini, dalam bahasa Indonesia"}`;

    return `${base}\n\n${modeInstruction}`;
}

function buildUserPrompt(
    message: string,
    options: string[],
    mode: "chat" | "choice"
): string {
    if (mode === "chat" || options.length === 0) {
        return message;
    }

    const opts = options
        .map((opt, idx) => {
            const letter = String.fromCharCode("A".charCodeAt(0) + idx);
            return `${letter}) ${opt}`;
        })
        .join("\n");

    return `
Situation:
${message}

Options:
${opts}
`.trim();
}

function safeParseChoice(raw: string): any {
    try {
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start >= 0 && end > start) {
            const jsonStr = raw.slice(start, end + 1);
            const parsed = JSON.parse(jsonStr);
            if (
                typeof parsed.choice === "string" &&
                typeof parsed.reason === "string"
            ) {
                return {
                    type: "choice",
                    choice: parsed.choice,
                    reason: parsed.reason
                };
            }
        }
    } catch {
        // ignore
    }

    // fallback: return as-is
    return {
        type: "choice",
        raw: raw
    };
}

function jsonResponse(obj: unknown, status: number = 200): Response {
    return new Response(JSON.stringify(obj), {
        status,
        headers: { "content-type": "application/json" }
    });
}

function corsResponse(response: Response, status?: number): Response {
    const newResponse = status ? new Response(response.body, { status }) : response;
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return newResponse;
}
