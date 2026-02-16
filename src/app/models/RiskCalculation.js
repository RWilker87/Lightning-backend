// src/app/models/RiskCalculation.js
import { Model, DataTypes } from "sequelize";

class RiskCalculation extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        parameters: DataTypes.JSONB,
        result: DataTypes.JSONB,
      },
      {
        sequelize,
        tableName: "risk_calculations",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default RiskCalculation;