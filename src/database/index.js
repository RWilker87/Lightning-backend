// src/database/index.js

import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";

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
    // Passa a URL como 1º argumento + config como opções.
    // O Sequelize só reconhece a URL quando passada diretamente como string.
    this.connection = new Sequelize(databaseConfig.url, databaseConfig);

    this.connection
      .authenticate()
      .then(() =>
        console.log("✅ Conexão com PostgreSQL (Supabase) estabelecida.")
      )
      .catch((err) =>
        console.error("❌ Falha ao conectar ao PostgreSQL:", err.message)
      );

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

const db = new Database();

export default db.connection;
