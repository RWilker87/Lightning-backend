import "dotenv/config"; // Carrega as variáveis do ficheiro .env

export default {
  dialect: "postgres",
  url: process.env.DATABASE_URL, // Lê a URL completa a partir do ficheiro .env

  // Opções específicas para o dialeto PostgreSQL
  dialectOptions: {
    // Em produção, o seu provedor de banco de dados (Supabase, Render, etc.)
    // irá exigir uma conexão segura com SSL. Em ambiente local (Docker), não é necessário.
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },

  // Configurações de padronização para todos os modelos (mantém como estava)
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
