// src/app/controllers/CalculationController.js

import * as Yup from "yup";
import RiskCalculation from "../models/RiskCalculation.js";
import riskCalculationService from "../../services/riskCalculationService.js";

class CalculationController {
  async store(req, res) {
    // Validação dos parâmetros obrigatórios do cálculo
    const schema = Yup.object().shape({
      Ng: Yup.number()
        .required("A densidade de descargas (Ng) é obrigatória.")
        .positive(),
      L: Yup.number()
        .required("O comprimento (L) é obrigatório.")
        .positive(),
      W: Yup.number().required("A largura (W) é obrigatória.").positive(),
      cd_localizacao: Yup.string().required(
        "A localização da estrutura é obrigatória."
      ),
      spda_classe: Yup.string().required("A classe do SPDA é obrigatória."),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Falha na validação.", messages: err.errors });
    }

    const parameters = req.body;
    const userId = req.userId;

    try {
      const calculationResult =
        riskCalculationService.calculateRisk(parameters);

      await RiskCalculation.create({
        user_id: userId,
        parameters,
        result: calculationResult,
      });

      return res.json(calculationResult);
    } catch (err) {
      console.error("Erro no cálculo:", err);
      return res
        .status(500)
        .json({ error: "Erro interno ao processar o cálculo." });
    }
  }
}

export default new CalculationController();
