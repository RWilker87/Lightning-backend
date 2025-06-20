// src/database/index.js
import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";

// Importe todos os seus modelos aqui
import User from "../app/models/User.js";
import Tenant from "../app/models/Tenant.js";
import License from "../app/models/License.js";
import RiskCalculation from "../app/models/RiskCalculation.js";

const models = [User, Tenant, License, RiskCalculation];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Esta é a instância da conexão do Sequelize
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

const db = new Database();

// MUDANÇA CRÍTICA: Exportamos a conexão diretamente.
// Agora, qualquer ficheiro que importe este, receberá o objeto de conexão do Sequelize.
export default db.connection;
