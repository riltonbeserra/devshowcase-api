import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Profile = sequelize.define('Profile', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O campo "name" não pode ser vazio.' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Informe um e-mail válido.' },
      notEmpty: { msg: 'O campo "email" não pode ser vazio.' }
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});