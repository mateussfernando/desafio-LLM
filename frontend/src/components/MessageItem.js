import { FiCode } from "react-icons/fi";

export default function MessageItem({ msg }) {
  function formatarResposta(texto) {
    const codeBlocks = texto.split(/```(\w*)?([\s\S]*?)```/g);

    return codeBlocks.map(function (block, i) {
      if (i % 3 === 2) {
        const language = codeBlocks[i - 1] || "";
        return (
          <div key={i} className="my-2">
            <div className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-x-auto">
              <div className="flex items-center text-xs text-gray-400 mb-1">
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
          <p key={i} className="whitespace-pre-wrap">
            {block}
          </p>
        );
      }
      return null;
    });
  }

  return (
    <div
      className={`flex ${
        msg.tipo === "pergunta" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-xl px-4 py-3 ${
          msg.tipo === "pergunta"
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            : "bg-white/10 backdrop-blur-md text-gray-100"
        }`}
      >
        {formatarResposta(msg.texto)}
      </div>
    </div>
  );
}
