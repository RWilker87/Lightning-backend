"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        // Converte TEXT para JSONB usando USING para cast explícito
        await queryInterface.sequelize.query(`
            ALTER TABLE "risk_calculations"
            ALTER COLUMN "parameters" TYPE JSONB
            USING COALESCE("parameters"::jsonb, '{}'::jsonb);
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE "risk_calculations"
            ALTER COLUMN "result" TYPE JSONB
            USING COALESCE("result"::jsonb, '{}'::jsonb);
        `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(`
            ALTER TABLE "risk_calculations"
            ALTER COLUMN "parameters" TYPE TEXT
            USING "parameters"::text;
        `);

        await queryInterface.sequelize.query(`
            ALTER TABLE "risk_calculations"
            ALTER COLUMN "result" TYPE TEXT
            USING "result"::text;
        `);
    },
};
