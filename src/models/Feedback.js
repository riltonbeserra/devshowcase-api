import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Feedback = sequelize.define('Feedback', {
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O campo "comment" não pode ser vazio.' }
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'A nota mínima é 1.' },
      max: { args: [5], msg: 'A nota máxima é 5.' }
    }
  }
});