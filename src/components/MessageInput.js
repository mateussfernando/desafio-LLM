import { FiSend } from "react-icons/fi";

export default function MessageInput({
  pergunta,
  setPergunta,
  carregando,
  enviarPergunta,
  handleKeyPress,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#dbe6ff] border-t border-blue-300">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mensagem para IA..."
            className="w-full p-4 pr-16 bg-white text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            disabled={carregando}
          />
          <button
            onClick={enviarPergunta}
            disabled={carregando || !pergunta.trim()}
            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
