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
      You are NutriGPT, a smart, playful, and interactive nutrition coach.
      The user just described what they ate today.

      Your task is to:

      1. Give a short nutrition score (A-F) and a one-line summary  
      2. Offer a simple improvement tip  
      3. Ask a fun quiz question  
      4. Recommend 3 alternative foods with emojis and links  
      5. Break content into clear short sections with line breaks (\n\n)  
      6. Keep the tone light, warm, and brief — no long explanations

      Use bold markdown (**Nutrition Score:**) and line breaks (\n\n) to separate sections.

      End with a short sentence inviting the user to ask more (e.g., Want more suggestions? Just ask!)



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
      <div className="relative min-h-[400px] max-h-[400px] overflow-y-auto px-4 py-2">
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