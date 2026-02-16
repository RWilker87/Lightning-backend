// src/server.js

import express from "express";
import cors from "cors";
import "dotenv/config";

import routes from "./routes.js";
import "./database/index.js";

const app = express();

// --- Configuração do CORS ---
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

// --- Error Handler Global ---
// Captura erros não tratados nos controllers e middlewares.
// Deve ser registado DEPOIS de todas as rotas.
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err.stack);
  return res
    .status(500)
    .json({ error: "Erro interno do servidor." });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Backend a rodar na porta ${PORT}`);
});
