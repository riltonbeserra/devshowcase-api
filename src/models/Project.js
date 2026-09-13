import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Project = sequelize.define('Project', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O campo "title" não pode ser vazio.' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O campo "description" não pode ser vazio.' }
    }
  },
  repoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: { msg: 'O campo "repoUrl" deve ser uma URL válida.' },
      notEmpty: { msg: 'O campo "repoUrl" não pode ser vazio.' }
    }
  }
});