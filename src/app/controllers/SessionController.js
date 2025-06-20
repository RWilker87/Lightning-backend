import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authConfig from "../../config/auth.js";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    // 1. Verifica apenas as credenciais do utilizador (email e senha)
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Utilizador ou senha inválidos." });
    }

    // 2. Se as credenciais estiverem corretas, gera o token imediatamente.
    // Nenhuma verificação de licença é feita aqui.
    const { id, name } = user;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({
      user: { id, name, email },
      token,
    });
  }
}

export default new SessionController();
