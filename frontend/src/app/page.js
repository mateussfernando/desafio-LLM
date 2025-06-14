"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ApiKeyModal from "../components/ApiKeyModal";

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
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const mensagensRef = useRef(null);

  // Verifica se já temos uma chave salva no localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("userApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  async function enviarPergunta() {
    if (!pergunta.trim()) return;

    setCarregando(true);
    const novaPergunta = { tipo: "pergunta", texto: pergunta };
    setConversa([...conversa, novaPergunta]);

    try {
      // Se não tiver API key e não for a primeira mensagem, mostra o modal
      if (!apiKey && conversa.length > 1) {
        setShowApiKeyModal(true);
        setCarregando(false);
        return;
      }

      const resposta = await axios.post(
        "http://localhost:3333/api/perguntar",
        {
          pergunta: pergunta,
        },
        {
          headers: apiKey ? { "X-API-KEY": apiKey } : {},
        }
      );

      const novaResposta = {
        tipo: "resposta",
        texto: resposta.data.resposta,
      };

      setConversa((prev) => [...prev, novaResposta]);
    } catch (erro) {
      console.error("Erro:", erro);

      // Se o erro for de autenticação, pede a chave de API
      if (erro.response?.status === 401) {
        setShowApiKeyModal(true);
        setConversa((prev) => [
          ...prev,
          {
            tipo: "resposta",
            texto:
              "🔑 Parece que precisamos configurar sua chave de API para continuar. Por favor, insira sua chave no modal que apareceu.",
          },
        ]);
      } else {
        setConversa((prev) => [
          ...prev,
          {
            tipo: "resposta",
            texto: "❌ Ocorreu um erro ao processar sua pergunta.",
          },
        ]);
      }
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

  const handleSaveApiKey = (key) => {
    localStorage.setItem("userApiKey", key);
    setApiKey(key);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-fixed bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('Base.jpg')" }}
    >
      <ChatHeader />

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

      <ApiKeyModal
        show={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}
