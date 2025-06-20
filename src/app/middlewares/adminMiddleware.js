// src/app/middlewares/adminMiddleware.js
import User from "../models/User.js";

export default async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user || !user.is_admin) {
      return res
        .status(403)
        .json({
          error: "Acesso negado: Recurso exclusivo para administradores.",
        });
    }

    return next();
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Erro interno ao verificar permissões de administrador.",
      });
  }
};
