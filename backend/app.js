require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3333;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint POST para enviar perguntas
app.post("/api/perguntar", async (req, res) => {
  try {
    const { pergunta } = req.body;
    const userApiKey = req.headers["x-api-key"] || OPENROUTER_API_KEY;

    if (!pergunta) {
      return res.status(400).json({ erro: "Pergunta é obrigatória" });
    }

    const startTime = Date.now();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content: `Você é Zênon um professor sênior de tecnologia com 20 anos de experiência. 
            Suas explicações são:
            - Clara e didática
            - Com exemplos práticos
            - Com analogias fáceis de entender
            - Com contexto de aplicação real
            - Técnica mas acessível
            Responda como se estivesse ensinando para alunos de graduação.`,
          },
          {
            role: "user",
            content: pergunta,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${userApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resposta = response.data.choices[0].message.content;
    const tempoResposta = (Date.now() - startTime) / 1000;

    res.json({
      pergunta,
      resposta,
      tempoResposta: tempoResposta.toFixed(2) + " segundos",
    });
  } catch (error) {
    console.error("Erro:", error);

    if (error.response?.status === 401) {
      return res.status(401).json({
        erro: "Chave de API inválida ou não fornecida",
        detalhes: "Por favor, configure uma chave de API válida",
      });
    }

    res.status(500).json({
      erro: "Falha ao processar pergunta",
      detalhes: error.message,
    });
  }
});

// Endpoint para configurar a chave de API do usuário
app.post("/api/set-api-key", (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ erro: "Chave de API é obrigatória" });
    }

    if (apiKey.length < 20) {
      return res.status(400).json({ erro: "Chave de API inválida" });
    }

    res.json({
      sucesso: true,
      mensagem: "Chave de API configurada com sucesso",
      // Em produção, considere criptografar ou armazenar de forma segura
      apiKey: apiKey,
    });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({
      erro: "Falha ao processar chave de API",
      detalhes: error.message,
    });
  }
});

// Endpoint GET para testar o serviço
app.get("/api/testar", (req, res) => {
  res.json({
    mensagem: "Serviço do Professor de Tecnologia está funcionando!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
app.get("/", (req, res) => {
  res.send(`
    <h1>Professor de Tecnologia API</h1>
    <p>Endpoints disponíveis:</p>
    <ul>
      <li>POST /api/perguntar</li>
      <li>POST /api/set-api-key</li>
      <li>GET /api/testar</li>
    </ul>
  `);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
