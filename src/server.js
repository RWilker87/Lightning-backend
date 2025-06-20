import express from "express";
import cors from "cors";

// Importe seu arquivo de rotas
import routes from "./routes.js";

// Importe e inicialize a conexão com o banco de dados
// (Se você seguiu a estrutura do database/index.js)
import "./database/index.js";

const app = express();

// Permite que o servidor entenda requisições com corpo em JSON
app.use(express.json());

// Permite que qualquer origem acesse sua API
app.use(cors());

// A LINHA MAIS IMPORTANTE: Conecta as rotas ao aplicativo
app.use(routes);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
