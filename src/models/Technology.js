import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Technology = sequelize.define('Technology', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'O campo "name" não pode ser vazio.' }
    }
  }
});