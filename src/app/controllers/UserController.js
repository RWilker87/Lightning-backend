// src/app/controllers/UserController.js

import { addDays } from "date-fns";
import * as Yup from "yup"; // Importando a biblioteca de validação
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";
import License from "../models/License.js";
import sequelize from "../../database/index.js";

class UserController {
  async store(req, res) {
    // --- NOVA VALIDAÇÃO DE ENTRADA ---
    const schema = Yup.object().shape({
      name: Yup.string().required("O nome é obrigatório."),
      email: Yup.string()
        .email("Formato de e-mail inválido.")
        .required("O e-mail é obrigatório."),
      password: Yup.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres.")
        .required("A senha é obrigatória."),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      // Se a validação falhar, retorna os erros específicos.
      return res
        .status(400)
        .json({ error: "Falha na validação.", messages: err.errors });
    }
    // --- FIM DA VALIDAÇÃO ---

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    const transaction = await sequelize.transaction();
    try {
      const tenant = await Tenant.create(
        { name: `Conta de ${name}` },
        { transaction }
      );

      const user = await User.create(
        { name, email, password, tenant_id: tenant.id },
        { transaction }
      );

      // Cria uma licença inativa por padrão
      await License.create(
        {
          tenant_id: tenant.id,
          valid_until: new Date(),
          active: false,
        },
        { transaction }
      );

      await transaction.commit();

      return res.status(201).json({
        id: user.id,
        name,
        email,
      });
    } catch (err) {
      await transaction.rollback();
      console.error("Erro no cadastro de utilizador:", err);
      return res
        .status(500)
        .json({ error: "Falha interna ao criar conta." });
    }
  }
}

export default new UserController();
