// src/scripts/checkConnection.js

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";

async function checkConnection() {
    console.log("🔌 Testando conexão com o banco de dados...\n");

    const url = databaseConfig.url;
    if (!url) {
        console.error("❌ DATABASE_URL não está definida no .env");
        process.exit(1);
    }

    const safeUrl = url.replace(/:([^@]+)@/, ":****@");
    console.log(`   URL: ${safeUrl}`);
    console.log(`   SSL: ${databaseConfig.dialectOptions.ssl ? "ativado" : "desativado"}`);
    console.log("");

    const sequelize = new Sequelize(url, databaseConfig);

    try {
        await sequelize.authenticate();
        console.log("✅ Conexão com PostgreSQL estabelecida com sucesso!");

        const [results] = await sequelize.query(
            "SELECT NOW() as server_time, current_database() as db_name"
        );
        console.log(`   Servidor: ${results[0].server_time}`);
        console.log(`   Banco:    ${results[0].db_name}`);

        const [tables] = await sequelize.query(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
        );
        console.log(`\n📋 Tabelas no banco (${tables.length}):`);
        tables.forEach((t) => console.log(`   - ${t.tablename}`));

        console.log("\n🎉 Tudo certo! O banco está funcionando.");
    } catch (err) {
        console.error("\n❌ Falha na conexão:");
        console.error(`   ${err.message}`);
        console.error("\n💡 Verifique:");
        console.error("   1. Se o DATABASE_URL no .env está correto");
        console.error("   2. Se o Docker está rodando (ambiente local)");
        console.error("   3. Se o projeto Supabase está ativo (ambiente produção)");
        console.error("   4. Se a senha não foi rotacionada recentemente");
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

checkConnection();
