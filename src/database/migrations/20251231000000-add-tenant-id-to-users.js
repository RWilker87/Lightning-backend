"use strict";
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "tenant_id", {
      type: Sequelize.UUID,
      references: { model: "tenants", key: "id" }, // Chave estrangeira
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // ou 'CASCADE' se preferir deletar o usuário junto
      allowNull: true, // Pode ser 'false' se todo usuário OBRIGATORIAMENTE tem um tenant
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "tenant_id");
  },
};
