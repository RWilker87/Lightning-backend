// src/app/middlewares/licenseMiddleware.js

import { Op } from "sequelize";
import User from "../models/User.js";
import License from "../models/License.js";

export default async (req, res, next) => {
  // Este middleware assume que o 'authMiddleware' já foi executado
  // e que req.userId está disponível.
  const { userId } = req;

  if (!userId) {
    return res
      .status(500)
      .json({
        error: "Falha na autenticação antes da verificação da licença.",
      });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ["tenant_id"],
      raw: true,
    });
    if (!user || !user.tenant_id) {
      return res
        .status(403)
        .json({ error: "Acesso proibido: Conta de utilizador inválida." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const license = await License.findOne({
      where: {
        tenant_id: user.tenant_id,
        active: true,
        valid_until: { [Op.gte]: today },
      },
    });

    if (!license) {
      return res
        .status(403)
        .json({
          error: "Acesso negado. Este recurso requer uma licença ativa.",
        });
    }

    // Se a licença for válida, permite o acesso.
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro interno ao verificar a licença." });
  }
};
