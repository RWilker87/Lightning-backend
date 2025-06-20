// src/app/models/User.js
import { Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: {
          type: DataTypes.VIRTUAL,
          allowNull: false,
        },
        password_hash: DataTypes.STRING,
        tenant_id: DataTypes.UUID,
        is_admin: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: "users",
      }
    );

    // Adiciona o hook ANTES de salvar o usuário no banco
    this.addHook("beforeSave", async (user) => {
      // Se o campo de senha foi preenchido, gera o hash
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Tenant, { foreignKey: "tenant_id", as: "tenant" });
    this.hasMany(models.RiskCalculation, {
      foreignKey: "user_id",
      as: "calculations",
    });
  }

  // Método para verificar a senha no login
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
