import { Op } from "sequelize";
import { addDays } from "date-fns";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import License from "../models/License.js";

class AdminController {
  // Lista todos os utilizadores e o estado das suas licenças
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "is_admin", "created_at"],
        include: {
          model: Tenant,
          as: "tenant",
          attributes: ["id"],
          include: {
            model: License,
            as: "licenses",
            attributes: ["valid_until", "active"],
            order: [["created_at", "DESC"]],
            limit: 1,
          },
        },
        order: [["created_at", "DESC"]],
      });
      return res.json(users);
    } catch (error) {
      console.error("Erro ao listar utilizadores:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar lista de utilizadores." });
    }
  }

  // Adiciona dias a uma licença de um utilizador
  async updateLicense(req, res) {
    const { userId } = req.params;
    const { daysToAdd } = req.body;

    if (!daysToAdd || isNaN(daysToAdd) || daysToAdd <= 0) {
      return res.status(400).json({ error: "Número de dias inválido." });
    }

    try {
      const user = await User.findByPk(userId, {
        include: { model: Tenant, as: "tenant" },
      });
      if (!user || !user.tenant_id) {
        return res.status(404).json({ error: "Utilizador não encontrado." });
      }

      const license = await License.findOne({
        where: { tenant_id: user.tenant_id },
        order: [["created_at", "DESC"]],
      });

      if (!license) {
        return res
          .status(404)
          .json({ error: "Licença não encontrada para este utilizador." });
      }

      const today = new Date();
      const validUntil = new Date(license.valid_until);

      // Se a licença já expirou, a renovação começa a contar de hoje.
      // Se ainda estiver válida, adiciona dias à data de expiração existente.
      const startDate = validUntil < today ? today : validUntil;

      license.valid_until = addDays(startDate, parseInt(daysToAdd, 10));
      license.active = true; // Garante que a licença seja reativada
      await license.save();

      return res.json(license);
    } catch (error) {
      console.error("Erro ao atualizar licença:", error);
      return res.status(500).json({ error: "Erro ao atualizar a licença." });
    }
  }
}

export default new AdminController();
