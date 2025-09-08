"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

export default function Home() {
  const [pergunta, setPergunta] = useState("");
  const [conversa, setConversa] = useState([
    {
      tipo: "resposta",
      texto:
        "Me forneça informações para que eu possa gerar um relatório para você. Preciso saber:\n\n" +
        "* Qual o assunto do relatório?\n* Qual o público-alvo?\n* Quais são os dados relevantes?\n* Qual o objetivo do relatório?\n* Qual o formato desejado?\n* Há algum template ou estrutura específica?\n\nQuanto mais detalhes, melhor e mais preciso será o relatório.",
    },
  ]);
  const [carregando, setCarregando] = useState(false);
  const [arquivos, setArquivos] = useState(null);
  const mensagensRef = useRef(null);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [conversa]);

  async function enviarPergunta() {
    if (!pergunta.trim()) return;

    setCarregando(true);
    setConversa((prev) => [...prev, { tipo: "pergunta", texto: pergunta }]);

    try {
      const resposta = await axios.post(
        "http://localhost:5000/gerar",
        { pergunta },
        { headers: { "Content-Type": "application/json" } }
      );

      setConversa((prev) => [
        ...prev,
        { tipo: "resposta", texto: resposta.data.resposta },
      ]);
      setArquivos(resposta.data.arquivos || null);
    } catch (erro) {
      console.error("Erro:", erro);
      setConversa((prev) => [
        ...prev,
        {
          tipo: "resposta",
          texto: "❌ Ocorreu um erro ao processar sua pergunta.",
        },
      ]);
    } finally {
      setCarregando(false);
      setPergunta("");
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !carregando) {
      e.preventDefault();
      enviarPergunta();
    }
  }

  return (
    <div className="bg-[#e6f0ff] min-h-screen flex flex-col">
      <header className="bg-blue-600 p-4 flex justify-center shadow-md">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-xl font-semibold text-white">
            TPF Engenharia - AI
          </h1>
        </div>
      </header>

      <MessageList
        conversa={conversa}
        carregando={carregando}
        mensagensRef={mensagensRef}
      />

      {arquivos && (
        <div className="flex justify-center gap-4 p-4">
          {arquivos.docx && (
            <a
              href={`http://localhost:5000${arquivos.docx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
            >
              Baixar DOCX
            </a>
          )}
          {arquivos.xlsx && (
            <a
              href={`http://localhost:5000${arquivos.xlsx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
            >
              Baixar XLSX
            </a>
          )}
          {arquivos.pdf && (
            <a
              href={`http://localhost:5000${arquivos.pdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
            >
              Baixar PDF
            </a>
          )}
        </div>
      )}

      <MessageInput
        pergunta={pergunta}
        setPergunta={setPergunta}
        carregando={carregando}
        enviarPergunta={enviarPergunta}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
}
