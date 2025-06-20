// src/server.js

import express from "express";
import cors from "cors";
import "dotenv/config";

import routes from "./routes.js";
import "./database/index.js";

const app = express();

// --- MELHORIA DE SEGURANÇA: Configuração do CORS ---
// Define quais domínios podem aceder ao seu backend.
// Em desenvolvimento, permite qualquer um. Em produção, apenas o seu frontend.
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL // Uma variável de ambiente para o URL do seu frontend (ex: https://meu-app.vercel.app)
      : "*", // Permite qualquer origem em desenvolvimento
};

app.use(cors(corsOptions));
console.log(`CORS configurado para permitir origem: ${corsOptions.origin}`);
// --- FIM DA MELHORIA ---

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Backend a rodar na porta ${PORT}`);
});
