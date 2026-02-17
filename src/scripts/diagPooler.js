// src/scripts/diagPooler.js — Teste focado no pooler com IPv4
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import Sequelize from "sequelize";

async function tryConnect(label, config) {
    console.log(`\n── ${label} ──`);
    const seq = new Sequelize(config);
    try {
        await seq.authenticate();
        const [r] = await seq.query("SELECT NOW() as t, current_database() as db");
        console.log(`   ✅ Conectou!`);
        console.log(`   Hora: ${r[0].t}`);
        console.log(`   DB:   ${r[0].db}`);
        return true;
    } catch (err) {
        console.log(`   ❌ ${err.message}`);
        if (err.original) console.log(`   Detail: ${err.original.message}`);
        return false;
    } finally {
        await seq.close();
    }
}

async function main() {
    console.log("🔍 Teste focado no Pooler Supabase\n");

    const password = "SWOgeyhDo7hBtEgY";
    const projectRef = "svvviifpfxxjqbuchquh";
    const poolerHost = "aws-0-sa-east-1.pooler.supabase.com";

    const sslOpts = { ssl: { require: true, rejectUnauthorized: false } };
    const noSslOpts = { ssl: false };

    // Teste 1: Pooler com SSL
    await tryConnect("Pooler 6543 + SSL", {
        dialect: "postgres",
        host: poolerHost,
        port: 6543,
        username: `postgres.${projectRef}`,
        password,
        database: "postgres",
        dialectOptions: sslOpts,
        logging: false,
    });

    // Teste 2: Pooler SEM SSL
    await tryConnect("Pooler 6543 SEM SSL", {
        dialect: "postgres",
        host: poolerHost,
        port: 6543,
        username: `postgres.${projectRef}`,
        password,
        database: "postgres",
        dialectOptions: noSslOpts,
        logging: false,
    });

    // Teste 3: Pooler via URL string (como no .env)
    const url = `postgresql://postgres.${projectRef}:${password}@${poolerHost}:6543/postgres`;
    console.log(`\n── Pooler via URL ──`);
    console.log(`   URL: ${url.replace(password, "****")}`);
    const seq = new Sequelize(url, {
        dialect: "postgres",
        dialectOptions: sslOpts,
        logging: false,
    });
    try {
        await seq.authenticate();
        console.log(`   ✅ Conectou!`);
    } catch (err) {
        console.log(`   ❌ ${err.message}`);
    } finally {
        await seq.close();
    }

    // Teste 4: Pooler por IP direto (bypass DNS)
    await tryConnect("Pooler por IP (54.94.90.106:6543)", {
        dialect: "postgres",
        host: "54.94.90.106",
        port: 6543,
        username: `postgres.${projectRef}`,
        password,
        database: "postgres",
        dialectOptions: sslOpts,
        logging: false,
    });

    console.log("\n🏁 Fim.");
}

main();
