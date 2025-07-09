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
      You are a friendly and trustworthy nutrition coach.
      When a user tells you what they ate, their eating habits, or their health concerns, 
      provide helpful advice, nutritional feedback, and healthy meal suggestions.
      Speak in a warm, conversational tone like a supportive coach.
      Do not give medical diagnoses—just practical and safe recommendations based on general nutrition principles.
      `,
    };

    // const newMessages = [systemMessage, ...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
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