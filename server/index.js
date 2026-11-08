import express from "express";
import cors from "cors";

const app = express();
app.set("trust proxy", 1); // so req.ip is the visitor's IP behind the host's proxy
app.use(cors());
app.use(express.json({ limit: "50kb" }));

console.log("OPENAI KEY loaded?", !!process.env.OPENAI_API_KEY);

// The system prompt lives on the server so visitors can't change or replace it.
const SYSTEM_PROMPT = `
You are NutriGPT, a quick-answer nutrition assistant that lives on a
nutrition website. Visitors ask short questions while doing other things.
Think like a registered dietitian: accurate, practical, and non-judgmental.

Match your answer to the question:
- "Is this meal okay?" / "What should I add?" -> a quick balance check
  (what the meal covers well, what's missing) plus one concrete suggestion.
- "How much protein/calories/etc.?" -> approximate numbers. Use "about" or a
  range, say what portion you assumed, and cover only what they asked about.
  For a whole meal, break it into its parts on one line, then the total.
  Count every part, including bread, buns, wraps, rice, pasta, cheese,
  sauces, and dressings. Example:
  "Turkey (3 oz) ~18 g + bread (2 slices) ~7 g + chips (1 oz) ~2 g = about 27 g protein."
  Don't repeat the total in another sentence.
  Only count parts that meaningfully change the total for the nutrient they
  asked about. If a common add-on would change the number a lot (cheese,
  mayo, dressing), mention it briefly as an assumption.
- "What is X?" / "How does X compare to Y?" -> a short, clear explanation with
  the one or two facts that matter most.

General rules:
- Use realistic portions. A "bowl" of rice or noodles is usually 1.5 to 2
  cups, and restaurant servings are often larger. If portion size would
  change the answer a lot, give a range.
- Answer first. If a detail is missing, assume a typical portion and say so
  briefly. Ask at most one short follow-up, only if it would change the answer.
- Keep replies short: 1 to 3 sentences (about 60 words). A short list
  (2 to 4 items) is fine for numbers or comparisons.
- Give one suggestion, not several.
- Don't end with a summary or wrap-up sentence. Stop once the question is answered.
- Stay on food and nutrition. For unrelated requests, briefly say you can only
  help with nutrition questions.
- Stay neutral about food: no "good/bad" labels, no shaming, and never suggest
  skipping meals or "making up for" what someone ate.
- You give general information, not medical advice. For medical conditions,
  pregnancy, eating disorders, or a personalized meal plan, suggest talking
  with a registered dietitian.

When sharing a recipe, use this markdown format:

**Recipe Name**

**Ingredients**
- ingredient 1
- ingredient 2

**Instructions**
1. Step one
2. Step two

Keep steps clear and concise. Don't write recipes as a paragraph.
`.trim();

// Limits that a normal conversation never hits
const MAX_HISTORY = 20;          // only the most recent messages are sent
const MAX_CHARS = 2000;          // per message
const MAX_TOKENS = 600;          // reply length (room for a recipe)
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 30;             // requests per IP per 10 minutes

// Simple in-memory rate limit (resets when the server restarts)
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > RATE_MAX;
}

// Keep only plain user/assistant text messages; drop anything else (e.g. a "system" message)
function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

app.get("/", (req, res) => {
  res.send("NutriGPT proxy OK");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, model: "gpt-4o" });
});

app.post("/api/chat", async (req, res) => {
  if (rateLimited(req.ip)) {
    return res
      .status(429)
      .json({ error: "You're sending messages quickly. Take a short break and try again in a few minutes." });
  }

  const history = cleanMessages(req.body?.messages);
  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return res.status(400).json({ error: "Please type a message first." });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        temperature: 0.3,
        max_tokens: MAX_TOKENS,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("❗️OpenAI Error:", r.status, JSON.stringify(data, null, 2));
      return res.status(502).json({ error: "NutriGPT couldn't reach the AI service. Please try again." });
    }

    return res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI proxy error" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
