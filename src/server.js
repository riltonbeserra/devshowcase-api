import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import { sequelize } from './models/index.js';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// 1. Rota de documentação Swagger UI (DEVE VIR ANTES DO 404)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 2. Rota de boas-vindas / status
app.get('/', (req, res) => {
  res.json({ message: 'DevShowcase API rodando com sucesso!' });
});

// 3. Rotas principais da API (/api)
app.use('/api', apiRoutes);

// 4. Middleware para rotas não encontradas (404)
// Tudo o que não for /api-docs, /, ou /api/... cairá aqui
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    error: `Rota ${req.originalUrl} não encontrada no servidor.`
  });
});

// 5. Middleware Global de Tratamento de Erros (sempre o último)
app.use(errorHandler);

// Sincronização e inicialização do servidor
async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
      console.log(`Swagger UI disponível em: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
  }
}

startServer();