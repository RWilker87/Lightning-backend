// src/routes.js
import { Router } from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "./app/middlewares/auth.js";
import licenseMiddleware from "./app/middlewares/proactiveLicenseCheck.js";
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import CalculationController from "./app/controllers/CalculationController.js";
import ProfileController from "./app/controllers/ProfileController.js";
import AdminController from "./app/controllers/AdminController.js";
import adminMiddleware from "./app/middlewares/adminMiddleware.js";
import HistoryController from "./app/controllers/HistoryController.js";

const routes = new Router();

// --- Rate Limiting para rotas públicas ---
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 requisições por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas tentativas. Tente novamente em 15 minutos.",
  },
});

// Rotas Públicas (com rate limiting)
routes.post("/users", publicLimiter, UserController.store);
routes.post("/login", publicLimiter, SessionController.store);

// Rotas que precisam apenas de autenticação
routes.get("/profile", authMiddleware, ProfileController.show);
routes.get("/history", authMiddleware, HistoryController.index);

// Rota de cálculo — autenticação + licença ativa
routes.post(
  "/calculations",
  authMiddleware,
  licenseMiddleware,
  CalculationController.store
);

// Rota de verificação de licença
routes.get("/check-license", authMiddleware, licenseMiddleware, (req, res) => {
  return res.status(200).json({ access: true, message: "Licença válida." });
});

// Rotas de administração
routes.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  AdminController.index
);
routes.put(
  "/admin/licenses/:userId",
  authMiddleware,
  adminMiddleware,
  AdminController.updateLicense
);

export default routes;
