import { useState, useRef, useEffect } from "react";

export default function InputBar({ onSend, loading}) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null); 


  useEffect(()=> {
    if(!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center flex-shrink-0 border-t border-gray-300 px-4 py-2 bg-white">
      <input 
      ref={inputRef} // connect ref to input
      className="flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none"
      type = "text"
      placeholder="e.g. Spaghetti? Salad? Spill it!"
      value= {input}
      onChange={(e)=> setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={loading} />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-2 text-sm font-medium bg-chatHeader text-white rounded-full hover:bg-chatHeader-600 disabled:opacity-50"
        disabled={loading}>
          {loading ? "..." : "📤"}
        </button>
    </div>
  )
}