// src/routes.js
import { Router } from "express";
import authMiddleware from "./app/middlewares/auth.js";
import licenseMiddleware from "./app/middlewares/proactiveLicenseCheck.js"; // Nosso novo porteiro
import UserController from "./app/controllers/UserController.js";
import SessionController from "./app/controllers/SessionController.js";
import CalculationController from "./app/controllers/CalculationController.js";
import ProfileController from "./app/controllers/ProfileController.js";
import AdminController from "./app/controllers/AdminController.js";
import adminMiddleware from "./app/middlewares/adminMiddleware.js";
import HistoryController from "./app/controllers/HistoryController.js";

const routes = new Router();

// Rotas Públicas (sem verificação)
routes.post("/users", UserController.store);
routes.post("/login", SessionController.store);

// Rotas que precisam apenas de autenticação (qualquer utilizador logado)
routes.get("/profile", authMiddleware, ProfileController.show);

// Rota de cálculo que precisa de AUTENTICAÇÃO E de uma LICENÇA ATIVA
routes.post(
  "/calculations",
  authMiddleware,
  licenseMiddleware,
  CalculationController.store
);

// Rota de verificação para o frontend, também protegida pela licença
routes.get("/check-license", authMiddleware, licenseMiddleware, (req, res) => {
  return res.status(200).json({ access: true, message: "Licença válida." });
});
routes.get("/history", authMiddleware, HistoryController.index);

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
