// backend/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3333; // Porta diferente do seu outro serviço

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint POST para enviar perguntas
app.post("/api/perguntar", async (req, res) => {
  try {
    const { pergunta } = req.body;

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
            content: `Você é Zênon um professor sênior de tecnologia. 
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
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
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
    res.status(500).json({
      erro: "Falha ao processar pergunta",
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
      <li>GET /api/testar</li>
    </ul>
  `);
});



// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
