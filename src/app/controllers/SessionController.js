// src/app/controllers/SessionController.js

import * as Yup from "yup";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authConfig from "../../config/auth.js";

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email("Formato de e-mail inválido.")
        .required("O e-mail é obrigatório."),
      password: Yup.string().required("A senha é obrigatória."),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Falha na validação.", messages: err.errors });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Utilizador ou senha inválidos." });
    }

    const { id, name, is_admin } = user;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({
      user: { id, name, email, is_admin },
      token,
    });
  }
}

export default new SessionController();
