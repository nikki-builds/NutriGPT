import { useState } from "react";
import Chat from "./components/Chat";

function App() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl flex flex-col bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Header */}
        <header className="bg-chatHeader text-white py-4 px-5 text-xl font-bold shadow-md flex items-center justify-between">
          <span>NutriGPT 🥗</span>
          <button
            onClick={() => setResetKey(k => k + 1)}
            className="text-xs font-normal bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
            New chat
          </button>
        </header>

        {/* Chat Component */}
        <Chat key={resetKey} />
      </div>
    </div>
  );
}

export default App;
