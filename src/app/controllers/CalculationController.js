import RiskCalculation from "../models/RiskCalculation.js";
import riskCalculationService from "../../services/riskCalculationService.js";

class CalculationController {
  async store(req, res) {
    const parameters = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      // 1. Chamar o serviço de cálculo
      const calculationResult =
        riskCalculationService.calculateRisk(parameters);

      // 2. Salvar o cálculo no banco de dados
      await RiskCalculation.create({
        user_id: userId,
        parameters: JSON.stringify(parameters),
        result: JSON.stringify(calculationResult),
      });

      // 3. Retornar o resultado completo para o frontend
      return res.json(calculationResult);
    } catch (err) {
      console.error("Erro no cálculo:", err);
      return res
        .status(500)
        .json({
          error: "Erro interno ao processar o cálculo.",
          details: err.message,
        });
    }
  }
}

export default new CalculationController();
