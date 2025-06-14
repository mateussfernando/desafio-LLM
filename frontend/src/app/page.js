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
        "Eu sou Zênon, sua IA especialista em tecnologia e programação!\n\nPosso te ajudar com:\n• Dúvidas sobre linguagens de programação\n• Conceitos de algoritmos e estruturas de dados\n• Frameworks e ferramentas de desenvolvimento\n• Melhores práticas e padrões de código\n• Carreira em TI e aprendizagem contínua\n\nPor onde gostaria de começar?",
    },
  ]);
  const [carregando, setCarregando] = useState(false);
  const mensagensRef = useRef(null);

  useEffect(
    function () {
      if (mensagensRef.current) {
        mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
      }
    },
    [conversa]
  );

  async function enviarPergunta() {
    if (!pergunta.trim()) return;

    setCarregando(true);
    const novaPergunta = { tipo: "pergunta", texto: pergunta };
    setConversa([...conversa, novaPergunta]);

    try {
      const resposta = await axios.post(
        "https://testezenonai.onrender.com/api/perguntar",
        {
          pergunta: pergunta,
        }
      );

      const novaResposta = {
        tipo: "resposta",
        texto: resposta.data.resposta,
      };

      setConversa(function (prev) {
        return [...prev, novaResposta];
      });
    } catch (erro) {
      console.error("Erro:", erro);
      setConversa(function (prev) {
        return [
          ...prev,
          {
            tipo: "resposta",
            texto: "❌ Ocorreu um erro ao processar sua pergunta.",
          },
        ];
      });
    } finally {
      setCarregando(false);
      setPergunta("");
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !carregando) {
      enviarPergunta();
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('Base.jpg')" }}
    >
      <header className="bg-white/5 backdrop-blur-md p-4 border-b border-white/10 flex justify-center">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-xl font-semibold text-white">Zênon</h1>
        </div>
      </header>

      <MessageList
        conversa={conversa}
        carregando={carregando}
        mensagensRef={mensagensRef}
      />

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
