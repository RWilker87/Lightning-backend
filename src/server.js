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
  process.env.FRONTEND_URL,                       // URL principal do frontend
  "https://lightning-frontend-rhy2.vercel.app",    // Vercel deploy
  "http://localhost:5173",                         // Vite dev server
  "http://localhost:3000",                         // Next.js / CRA dev server
].filter(Boolean);

console.log("🔧 CORS allowedOrigins:", allowedOrigins);
console.log("🔧 NODE_ENV:", process.env.NODE_ENV);

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requests sem origin (Postman, mobile, curl)
    if (!origin) return callback(null, true);

    // Em dev libera tudo
    if (process.env.NODE_ENV !== "production") return callback(null, true);

    // Em produção valida lista
    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.warn(`⚠️ CORS bloqueou origin: ${origin}`);
    return callback(new Error(`Bloqueado pelo CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

// --- Health Check (sem auth) ---
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

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
