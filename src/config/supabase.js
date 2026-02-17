// src/config/supabase.js
//
// Cliente Supabase para funcionalidades extras (Auth, Storage, Realtime).
// O banco de dados principal é acessado pelo Sequelize (database.js).
// Este client é para quando precisar usar a API REST do Supabase diretamente.
//

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
        "⚠️  SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidas. " +
        "O client Supabase não estará disponível."
    );
}

// Usa a Service Role Key no backend para acesso administrativo.
// NUNCA exponha esta chave no frontend.
const supabase =
    supabaseUrl && supabaseServiceKey
        ? createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        })
        : null;

export default supabase;
