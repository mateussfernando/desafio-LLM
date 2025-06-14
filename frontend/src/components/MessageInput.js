import { FiSend } from "react-icons/fi";

export default function MessageInput({
  pergunta,
  setPergunta,
  carregando,
  enviarPergunta,
  handleKeyPress,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mensagem para Zênon..."
            className="w-full p-4 pr-16 bg-gray-900 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            disabled={carregando}
          />
          <button
            onClick={enviarPergunta}
            disabled={carregando || !pergunta.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-600"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
