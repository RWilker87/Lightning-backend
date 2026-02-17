// src/config/database.cjs

require("dotenv/config");

// DATABASE_URL → session pooler (IPv4 compatível)
// DIRECT_URL  → conexão direta (somente IPv6 no plano Nano)
const url = process.env.DATABASE_URL || process.env.DIRECT_URL;

const requiresSSL =
    process.env.NODE_ENV === "production" ||
    (url && url.includes("supabase"));

module.exports = {
    url: url,
    dialect: "postgres",

    dialectOptions: {
        ssl: requiresSSL
            ? { require: true, rejectUnauthorized: false }
            : false,
    },

    pool: {
        max: 3,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },

    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },

    logging: process.env.NODE_ENV === "production" ? false : console.log,
};
