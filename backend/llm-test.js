// backend/llm-test.js
require("dotenv").config();
const axios = require("axios");
const readline = require("readline");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function testOpenRouter(question) {
  const startTime = Date.now();

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "anthropic/claude-3-haiku",
      messages: [
        {
          role: "system",
          content: `Você é um professor sênior de tecnologia com 20 anos de experiência. 
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
          content: question,
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

  const answer = response.data.choices[0].message.content;
  const generationTime = (Date.now() - startTime) / 1000;

  console.log("\nResposta do Professor:");
  console.log("--------------------------------------------------");
  console.log(answer);
  console.log("--------------------------------------------------");
  console.log(`\nTempo de resposta: ${generationTime.toFixed(2)} segundos\n`);
  askQuestion();
}

function askQuestion() {
  rl.question(
    "\nPergunte ao Professor de Tecnologia (ou 'sair'): ",
    (input) => {
      if (input.toLowerCase().trim() === "sair") {
        rl.close();
        return;
      }
      testOpenRouter(input);
    }
  );
}

console.log("Professor Sênior de Tecnologia - Digite 'sair' para encerrar\n");
askQuestion();

rl.on("close", () => process.exit(0));
