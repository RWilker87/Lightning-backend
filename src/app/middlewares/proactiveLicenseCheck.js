// src/app/middlewares/proactiveLicenseCheck.js
import User from "../models/User.js";
import License from "../models/License.js";

export default async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["tenant_id"],
      raw: true,
    });
    if (!user || !user.tenant_id) {
      return res
        .status(403)
        .json({ error: "Acesso proibido: Conta inválida." });
    }

    const license = await License.findOne({
      where: { tenant_id: user.tenant_id },
      order: [["created_at", "DESC"]],
    });

    if (!license) {
      return res
        .status(403)
        .json({ error: "Acesso negado: Nenhuma licença encontrada." });
    }

    const today = new Date();
    const validUntil = new Date(license.valid_until);

    // 1. A licença está expirada?
    if (validUntil < today) {
      if (license.active) {
        license.active = false;
        await license.save();
      }
      return res.status(403).json({ error: "A sua licença expirou." });
    }

    // 2. Licença dentro do prazo mas inativa — reativar
    if (license.active === false || license.active === 0) {
      license.active = true;
      await license.save();
      return next();
    }

    // 3. Licença ativa e válida
    return next();
  } catch (error) {
    console.error("Erro inesperado no middleware de licença:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao verificar a licença." });
  }
};
