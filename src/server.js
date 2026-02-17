// src/server.js

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import "dotenv/config";

import routes from "./routes.js";
import "./database/index.js";

const app = express();

// --- Configuração do CORS ---
const allowedOrigins = [
  process.env.FRONTEND_URL,        // URL de produção do frontend
  "http://localhost:5173",          // Vite dev server
  "http://localhost:3000",          // Next.js / CRA dev server
].filter(Boolean); // Remove valores undefined/null

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? (origin, callback) => {
        // Permite requests sem origin (ex: mobile, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Bloqueado pelo CORS."));
        }
      }
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
