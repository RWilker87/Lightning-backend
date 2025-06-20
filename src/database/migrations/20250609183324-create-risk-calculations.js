"use strict";
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("risk_calculations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        // Chave estrangeira para users
        type: Sequelize.INTEGER, // Assumindo que o ID do usuário ainda é INTEGER
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      parameters: {
        // Para o tipo Json, usamos TEXT no SQLite
        type: Sequelize.TEXT,
        allowNull: false,
      },
      result: {
        // Para o tipo Json, usamos TEXT no SQLite
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("risk_calculations");
  },
};
