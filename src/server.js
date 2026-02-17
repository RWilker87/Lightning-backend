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
  origin: (origin, callback) => {
    // Permite requests sem origin (Postman, mobile)
    if (!origin) return callback(null, true);

    // Em dev libera tudo
    if (process.env.NODE_ENV !== "production") return callback(null, true);

    // Em produção valida lista
    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error(`Bloqueado pelo CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.options("*", cors(corsOptions));
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
