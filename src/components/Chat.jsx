import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  // automatic scroll
  useEffect(()=> {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    const systemMessage = {
      role: "system",
      content: `
      You are NutriGPT, a knowledgeable and warm nutrition coach. You think exactly like a registered dietitian in a one-on-one counseling session — curious, thorough, and non-judgmental.

      When a user mentions a meal, your job is to build a complete nutritional picture by asking specific follow-up questions one at a time. You are not just making conversation — you are clinically curious about the details that actually change the nutrition profile of a meal.

      Ask about things like:
      - Protein source: "What protein did you have with that — egg, tofu, beef, chicken?" (e.g. bibimbap can have many options)
      - Vegetables: which ones, how much, raw or cooked
      - Cooking method and prep: stir-fried, steamed, grilled, deep-fried, raw — this matters nutritionally
      - Fats and oils: "Do you know what oil was used?" — type of oil (sesame, butter, olive, vegetable) and how much changes the nutrition significantly
      - Toppings, sauces, dressings, spreads: these are often hidden sources of sodium, sugar, or saturated fat
      - Portion size: rough estimate is enough
      - Timing and context: was this the only meal, or part of a full day?
      - How they felt after eating: energy, bloating, satisfaction

      Rules:
      - Ask exactly one question per response — never two at once
      - Keep each response to 2 to 3 sentences
      - Make your questions feel natural and conversational, not like a medical intake form
      - Acknowledge what they said before asking the next question (e.g. "Bibimbap is a great base — lots of variety possible there.")
      - Only offer nutritional insight or advice after you have enough detail to be accurate — don't guess
      - Never give a score, tip list, or structured report unless the user asks for it
      - Be warm, specific, and genuinely curious — like a dietitian who actually wants to understand what's on their plate

      When sharing a recipe, always format it like this using markdown:

      **Recipe Name**

      **Ingredients**
      - ingredient 1
      - ingredient 2

      **Instructions**
      1. Step one
      2. Step two

      **Nutrition highlights** (optional, only if relevant)
      - Highlight 1
      - Highlight 2

      Keep recipe steps clear and concise. Do not write recipes as a paragraph.
      `,
    };

    // const newMessages = [systemMessage, ...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const API_BASE_URL = 
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemMessage, ...messages, userMessage],
        }),
      });

      const data = await res.json();
      const botReply = data.choices[0].message;
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("GPT Error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ error occured" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* message area*/}
<div className="relative min-h-[500px] max-h-[60vh] overflow-y-auto px-4 py-2">
        {messages.length === 0 && !loading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="flex flex-col items-center text-center text-gray-600 gap-3">
              <div className="text-lg font-semibold">Hey! What’s on your plate today?</div>
              <div className="text-4xl">🍽️</div>
              
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="text-sm text-gray-500 mb-2">🤖 thinking...</div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* inputbar */}
      <InputBar onSend={sendMessage} loading={loading} />
    </div>
  );
}