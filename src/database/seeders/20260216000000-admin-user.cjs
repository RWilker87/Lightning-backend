// src/database/seeders/20260216000000-admin-user.cjs
//
// Seed que cria o usuário admin padrão com Tenant e Licença permanente.
// Roda com: npx sequelize-cli db:seed:all

"use strict";

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

module.exports = {
    async up(queryInterface) {
        const tenantId = crypto.randomUUID();
        const now = new Date();

        // 1. Criar Tenant do admin
        await queryInterface.bulkInsert(
            "tenants",
            [
                {
                    id: tenantId,
                    name: "Administração",
                    created_at: now,
                    updated_at: now,
                },
            ],
            { ignoreDuplicates: true }
        );

        // 2. Criar usuário admin
        const passwordHash = await bcrypt.hash("Admin@123", 8);

        await queryInterface.bulkInsert(
            "users",
            [
                {
                    name: "Administrador",
                    email: "admin@lightning.com",
                    password_hash: passwordHash,
                    tenant_id: tenantId,
                    is_admin: true,
                    created_at: now,
                    updated_at: now,
                },
            ],
            { ignoreDuplicates: true }
        );

        // 3. Criar licença permanente para o admin (válida até 2099)
        await queryInterface.bulkInsert(
            "licenses",
            [
                {
                    id: crypto.randomUUID(),
                    tenant_id: tenantId,
                    valid_until: new Date("2099-12-31"),
                    active: true,
                    created_at: now,
                    updated_at: now,
                },
            ],
            { ignoreDuplicates: true }
        );
    },

    async down(queryInterface) {
        // Remove na ordem inversa por causa das foreign keys
        await queryInterface.bulkDelete("licenses", null, {});
        await queryInterface.bulkDelete("users", {
            email: "admin@lightning.com",
        });
        await queryInterface.bulkDelete("tenants", { name: "Administração" });
    },
};
