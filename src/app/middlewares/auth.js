// src/app/middlewares/auth.js

import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/auth.js";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Acesso negado: Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id; // Anexa o ID do utilizador à requisição
    return next(); // Permite o acesso se o token for válido
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Acesso negado: Token inválido ou expirado." });
  }
};
