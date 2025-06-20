// src/app/middlewares/proactiveLicenseCheck.js
import User from "../models/User.js";
import License from "../models/License.js";

export default async (req, res, next) => {
  // Este middleware assume que o auth.js já validou o token e adicionou req.userId
  console.log("\n--- [INICIANDO VERIFICAÇÃO DE LICENÇA] ---");
  const { userId } = req;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["tenant_id"],
      raw: true,
    });
    if (!user || !user.tenant_id) {
      console.log("[ERRO] Utilizador ou tenant_id não encontrado.");
      return res
        .status(403)
        .json({ error: "Acesso proibido: Conta inválida." });
    }
    console.log(`[INFO] A verificar tenant_id: ${user.tenant_id}`);

    const license = await License.findOne({
      where: { tenant_id: user.tenant_id },
      order: [["created_at", "DESC"]],
    });

    if (!license) {
      console.log("[ERRO] Nenhuma licença encontrada para este tenant.");
      return res
        .status(403)
        .json({ error: "Acesso negado: Nenhuma licença encontrada." });
    }

    console.log(
      "[INFO] Licença encontrada:",
      JSON.stringify(license.get({ plain: true }), null, 2)
    );

    const today = new Date();
    const validUntil = new Date(license.valid_until);

    console.log(
      `[VERIFICAÇÃO] Data de Validade: ${validUntil.toISOString()} | Data de Hoje: ${today.toISOString()}`
    );

    // --- NOVA LÓGICA DE VERIFICAÇÃO ---

    // 1. A licença está expirada? Esta é a verificação mais importante.
    if (validUntil < today) {
      // Se a data já passou, não importa se estava ativa ou não. Ela deve ser desativada.
      if (license.active) {
        console.log(`[AÇÃO] Licença expirou. A desativar no banco de dados.`);
        license.active = false;
        await license.save();
      }
      console.log(`[RESULTADO] Acesso NEGADO. Licença expirada.`);
      return res.status(403).json({ error: "A sua licença expirou." });
    }

    // 2. Se a data NÃO expirou, verificamos se a licença está inativa.
    //    Este é o cenário de reativação.
    if (license.active === false || license.active === 0) {
      console.log(
        `[AÇÃO] Licença está inativa, mas dentro do prazo. A reativar...`
      );
      license.active = true;
      await license.save(); // ATUALIZA O BANCO DE DADOS
      console.log(
        `[RESULTADO] Licença reativada com sucesso. Acesso PERMITIDO.`
      );
      return next(); // Permite o acesso
    }

    // 3. Se chegou até aqui, a licença está ativa e dentro do prazo.
    console.log(
      "[RESULTADO] Acesso PERMITIDO. Licença já está ativa e válida."
    );
    return next();
  } catch (error) {
    console.error(
      "[ERRO FATAL] Ocorreu um erro inesperado no middleware de licença:",
      error
    );
    return res
      .status(500)
      .json({ error: "Erro interno ao verificar a licença." });
  }
};
