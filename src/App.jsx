import Chat from "./components/Chat";
import InputBar from "./components/InputBar";

function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl flex flex-col bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Header */}
        <header className="bg-chatHeader text-white text-center py-4 text-xl font-bold shadow-md overflow-hidden">NutriGPT 🥗</header>
    
        
        {/* Chat Component */}
        <Chat />
      </div>
    </div>
  );
}

export default App;
