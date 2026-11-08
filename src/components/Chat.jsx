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

    // The system prompt now lives on the server (server/index.js),
    // so the browser only sends the conversation itself.

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const API_BASE_URL = 
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();

      // Show the server's friendly message (e.g. rate limit) instead of crashing
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Something went wrong. Please try again." },
        ]);
        return;
      }

      const botReply = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
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