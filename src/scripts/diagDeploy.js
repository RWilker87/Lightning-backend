// src/scripts/diagDeploy.js
// Diagnóstico completo: DNS, DB, Health, CORS preflight, Login
//
// Uso LOCAL:  node src/scripts/diagDeploy.js http://localhost:3333
// Uso RENDER: node src/scripts/diagDeploy.js https://lightning-backend-f16y.onrender.com

import dns from "node:dns/promises";
import "dotenv/config";

const BASE =
    process.argv[2] || "https://lightning-backend-f16y.onrender.com";
const FRONTEND_ORIGIN = "https://lightning-frontend-rhy2.vercel.app";

const ok = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg) => console.error(`  ❌ ${msg}`);
const warn = (msg) => console.warn(`  ⚠️  ${msg}`);

async function diagDNS() {
    console.log("\n─── 1. DNS do Supabase ───");
    const host = "aws-1-sa-east-1.pooler.supabase.com";
    try {
        const addrs = await dns.resolve4(host);
        ok(`${host} → ${addrs.join(", ")}`);
    } catch (e) {
        fail(`DNS falhou para ${host}: ${e.message}`);
    }
}

async function diagHealth() {
    console.log("\n─── 2. Health Check ───");
    try {
        const res = await fetch(`${BASE}/health`);
        const body = await res.json();
        if (res.ok && body.ok) {
            ok(`GET /health → ${res.status} — env: ${body.env}`);
        } else {
            fail(`GET /health → ${res.status} — ${JSON.stringify(body)}`);
        }
    } catch (e) {
        fail(`GET /health falhou: ${e.message}`);
    }
}

async function diagCORS() {
    console.log("\n─── 3. CORS Preflight (OPTIONS /login) ───");
    try {
        const res = await fetch(`${BASE}/login`, {
            method: "OPTIONS",
            headers: {
                Origin: FRONTEND_ORIGIN,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type,authorization",
            },
        });

        const acao = res.headers.get("access-control-allow-origin");
        const acam = res.headers.get("access-control-allow-methods");
        const acah = res.headers.get("access-control-allow-headers");

        console.log(`  Status: ${res.status}`);
        console.log(`  Access-Control-Allow-Origin:  ${acao || "(ausente)"}`);
        console.log(`  Access-Control-Allow-Methods: ${acam || "(ausente)"}`);
        console.log(`  Access-Control-Allow-Headers: ${acah || "(ausente)"}`);

        if (acao === FRONTEND_ORIGIN || acao === "*") {
            ok("Origin do frontend é permitido");
        } else {
            fail(`Origin ${FRONTEND_ORIGIN} NÃO está na resposta CORS`);
        }

        if (res.status === 204 || res.status === 200) {
            ok(`Preflight OK (${res.status})`);
        } else {
            fail(`Preflight retornou ${res.status}`);
        }
    } catch (e) {
        fail(`Preflight falhou: ${e.message}`);
    }
}

async function diagLogin() {
    console.log("\n─── 4. POST /login ───");
    try {
        const res = await fetch(`${BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Origin: FRONTEND_ORIGIN,
            },
            body: JSON.stringify({
                email: "admin@lightning.com",
                password: "Admin@123",
            }),
        });

        const body = await res.json();
        console.log(`  Status: ${res.status}`);

        if (res.ok && body.token) {
            ok(`Login OK — user: ${body.user?.name}, is_admin: ${body.user?.is_admin}`);
            ok(`Token: ${body.token.slice(0, 20)}...`);
        } else {
            fail(`Login falhou: ${JSON.stringify(body)}`);
        }

        const acao = res.headers.get("access-control-allow-origin");
        if (acao) {
            ok(`CORS header na resposta: ${acao}`);
        } else {
            warn("Sem header Access-Control-Allow-Origin na resposta");
        }
    } catch (e) {
        fail(`POST /login falhou: ${e.message}`);
    }
}

async function diagRoutes() {
    console.log("\n─── 5. Rotas Disponíveis ───");
    const routes = [
        { method: "POST", path: "/users", desc: "Cadastro" },
        { method: "POST", path: "/login", desc: "Login" },
        { method: "GET", path: "/health", desc: "Health check" },
        { method: "GET", path: "/profile", desc: "Perfil (auth)" },
        { method: "GET", path: "/history", desc: "Histórico (auth)" },
        { method: "POST", path: "/calculations", desc: "Cálculo (auth+license)" },
        { method: "GET", path: "/check-license", desc: "Verificar licença" },
        { method: "GET", path: "/admin/users", desc: "Listar users (admin)" },
        { method: "PUT", path: "/admin/licenses/:id", desc: "Autorizar (admin)" },
        { method: "DELETE", path: "/admin/licenses/:id", desc: "Revogar (admin)" },
    ];

    for (const r of routes) {
        console.log(`  ${r.method.padEnd(6)} ${r.path.padEnd(25)} → ${r.desc}`);
    }
}

// --- Executar tudo ---
console.log(`\n🔍 Diagnóstico do Backend: ${BASE}`);
console.log("═".repeat(50));

await diagDNS();
await diagHealth();
await diagCORS();
await diagLogin();
await diagRoutes();

console.log("\n" + "═".repeat(50));
console.log("🏁 Diagnóstico completo!\n");
