// src/scripts/diagConnection.js — Diagnóstico completo de conexão
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import Sequelize from "sequelize";

async function tryConnect(label, config) {
    console.log(`\n── Teste: ${label} ──`);
    const seq = new Sequelize(config);
    try {
        await seq.authenticate();
        const [r] = await seq.query("SELECT NOW() as t");
        console.log(`   ✅ Conectou! Hora do servidor: ${r[0].t}`);
        return true;
    } catch (err) {
        console.log(`   ❌ Falhou: ${err.message}`);
        return false;
    } finally {
        await seq.close();
    }
}

async function main() {
    console.log("🔍 Diagnóstico de conexão Supabase\n");

    const password = "SWOgeyhDo7hBtEgY";
    const projectRef = "svvviifpfxxjqbuchquh";

    // Teste 1: Pooler (porta 6543) com parâmetros explícitos
    await tryConnect("Pooler (6543) - params explícitos", {
        dialect: "postgres",
        host: `aws-0-sa-east-1.pooler.supabase.com`,
        port: 6543,
        username: `postgres.${projectRef}`,
        password: password,
        database: "postgres",
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    });

    // Teste 2: Pooler Session mode (porta 5432)
    await tryConnect("Pooler Session (5432) - params explícitos", {
        dialect: "postgres",
        host: `aws-0-sa-east-1.pooler.supabase.com`,
        port: 5432,
        username: `postgres.${projectRef}`,
        password: password,
        database: "postgres",
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    });

    // Teste 3: Direto IPv4 (porta 5432)
    await tryConnect("Direto (5432) - params explícitos", {
        dialect: "postgres",
        host: `db.${projectRef}.supabase.co`,
        port: 5432,
        username: "postgres",
        password: password,
        database: "postgres",
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    });

    // Teste 4: Usando a URL do .env diretamente
    if (process.env.DATABASE_URL) {
        await tryConnect("DATABASE_URL do .env", {
            dialect: "postgres",
            url: process.env.DATABASE_URL,
            dialectOptions: {
                ssl: { require: true, rejectUnauthorized: false },
            },
            logging: false,
        });
    }

    console.log("\n🏁 Diagnóstico finalizado.");
}

main();
