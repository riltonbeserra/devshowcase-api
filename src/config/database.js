import { Sequelize } from 'sequelize';

// Configuração do SQLite: cria o arquivo local database.sqlite
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false // Deixa o terminal limpo sem imprimir todos os comandos SQL
});