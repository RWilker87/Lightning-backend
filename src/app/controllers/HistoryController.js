import RiskCalculation from "../models/RiskCalculation.js";

class HistoryController {
  // Lista todos os cálculos feitos pelo utilizador logado
  async index(req, res) {
    try {
      const calculations = await RiskCalculation.findAll({
        where: { user_id: req.userId },
        order: [["created_at", "DESC"]], // Mostra os mais recentes primeiro
        attributes: ["id", "parameters", "result", "created_at"],
      });

      return res.json(calculations);
    } catch (error) {
      console.error("Erro ao buscar histórico de cálculos:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar histórico de cálculos." });
    }
  }
}

export default new HistoryController();
