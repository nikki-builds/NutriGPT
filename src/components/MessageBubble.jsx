import ReactMarkdown from "react-markdown";

export default function MessageBubble({role, content}) {
  const isUser = role === "user";
  const isBot = role === "assistant";
  const time = new Date().toLocaleDateString([], {hour: '2-digit', minute: '2-digit'});

  const bubbleClass = isUser 
    ? "bg-bubbleUser text-white rounded-br-none"
    : isBot
    ? "bg-bubbleBot text-gray-800 rounded-bl-none"
    : "bg-bubbleSystem text-gray-700 rounded-full";

    const bubblePosition = isUser ? "justify-end" : "justify-start";

    const senderLabel = isUser
    ? "🙂 You" 
    : isBot 
    ? "🤖 NutriGPT" 
    : "⚙️ System";

  return (
    <div className={`flex ${bubblePosition} mb-4`}>
      <div className="flex flex-col max-w-[75%] animate-fade-in">

        <span className={`text-xs mb-1 ${isUser ? "text-right" : "text-left"} text-gray-500`}>
            {senderLabel}
          </span>

        <div className={`px-4 py-2 rounded-2xl text-sm prose prose-sm max-w-none ${bubbleClass}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        <span className={`text-[10px] text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {time}
        </span> 

      </div>
    </div>
  );
}