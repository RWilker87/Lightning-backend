"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Converte a coluna 'parameters' de TEXT para JSONB
        await queryInterface.changeColumn("risk_calculations", "parameters", {
            type: Sequelize.JSONB,
            allowNull: true,
        });

        // Converte a coluna 'result' de TEXT para JSONB
        await queryInterface.changeColumn("risk_calculations", "result", {
            type: Sequelize.JSONB,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        // Reverte para TEXT
        await queryInterface.changeColumn("risk_calculations", "parameters", {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        await queryInterface.changeColumn("risk_calculations", "result", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },
};
