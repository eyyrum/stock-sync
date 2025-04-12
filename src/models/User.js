const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'buyer',
    validate: {
      isIn: [['buyer', 'seller']]
    }
  }
}, {
  timestamps: true,
  tableName: 'users',
  underscored: true
});

module.exports = User;
