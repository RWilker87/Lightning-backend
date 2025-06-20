// src/app/controllers/ProfileController.js

import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import License from "../models/License.js";

class ProfileController {
  async show(req, res) {
    // Se a execução chegou até aqui, o middleware auth.js já garantiu
    // que o token é válido e que existe uma licença ativa.
    // A função deste controller é apenas retornar os dados do perfil para o frontend.

    try {
      // 1. Busca os dados do utilizador através do ID que o middleware forneceu.
      const user = await User.findByPk(req.userId, {
        attributes: ["id", "name", "email", "is_admin"],
        include: [
          {
            // Incluímos o Tenant para obter o ID da "conta" do utilizador
            model: Tenant,
            as: "tenant",
            attributes: ["id"],
          },
        ],
      });

      if (!user || !user.tenant) {
        // Esta verificação é uma segurança adicional, mas improvável de acontecer
        // se o authMiddleware estiver a funcionar corretamente.
        return res
          .status(404)
          .json({ error: "Utilizador ou conta não encontrado." });
      }

      // 2. Busca a licença mais recente do utilizador para exibir a data de validade no frontend.
      const license = await License.findOne({
        where: { tenant_id: user.tenant.id },
        order: [["valid_until", "DESC"]], // Pega a licença com a data de validade mais distante
      });

      // 3. Retorna um objeto limpo com os dados do utilizador e da sua licença.
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_admin: user.is_admin,
        },
        license: license
          ? { validUntil: license.valid_until, active: license.active }
          : null, // Retorna null se, por algum motivo, não houver licença
      });
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao processar o perfil." });
    }
  }
}

export default new ProfileController();
