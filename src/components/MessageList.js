import { FiCode } from "react-icons/fi";
import LoadingIndicator from "./LoadingIndicator";

export default function MessageList({ conversa, carregando, mensagensRef }) {
  function formatarResposta(texto) {
    const codeBlocks = texto.split(/```(\w*)?([\s\S]*?)```/g);
    return codeBlocks.map(function (block, i) {
      if (i % 3 === 2) {
        const language = codeBlocks[i - 1] || "";
        return (
          <div key={i} className="my-2">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto border border-gray-300">
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <FiCode className="mr-1" />
                {language || "code"}
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {block.trim()}
              </pre>
            </div>
          </div>
        );
      } else if (block) {
        return (
          <p key={i} className="whitespace-pre-wrap text-gray-800">
            {block}
          </p>
        );
      }
      return null;
    });
  }

  return (
    <div
      ref={mensagensRef}
      className="flex-1 p-4 overflow-y-auto space-y-6 max-w-4xl w-full mx-auto pb-32"
    >
      {conversa.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.tipo === "pergunta" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-3xl rounded-xl px-4 py-3 ${
              msg.tipo === "pergunta"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 shadow-sm border border-gray-200"
            }`}
          >
            {formatarResposta(msg.texto)}
          </div>
        </div>
      ))}
      {carregando && <LoadingIndicator />}
    </div>
  );
}
