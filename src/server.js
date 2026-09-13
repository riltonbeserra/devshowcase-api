import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API sob o prefixo /api
app.use('/api', apiRoutes);

// Rota de boas-vindas / teste rápido
app.get('/', (req, res) => {
  res.json({ message: 'DevShowcase API rodando com sucesso!' });
});

// Sincronização com o Banco de Dados e Inicialização do Servidor
async function startServer() {
  try {
    // Sincroniza os modelos com o banco SQLite (cria tabelas e associações)
    await sequelize.sync();
    console.log('Banco de dados SQLite sincronizado com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
  }
}

startServer();