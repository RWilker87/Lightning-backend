"use strict";
// Usamos 'export default' em vez de 'module.exports'
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "is_admin", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "is_admin");
  },
};
