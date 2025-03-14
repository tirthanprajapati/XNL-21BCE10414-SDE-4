const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  transaction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  asset_id: { type: DataTypes.STRING(10), allowNull: false },
  type: { type: DataTypes.STRING(4), allowNull: false },
  quantity: { type: DataTypes.DECIMAL(18, 8), allowNull: false },
  price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  fee: { type: DataTypes.DECIMAL(18, 2), defaultValue: 0 },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  indexes: [
    { fields: ['user_id', 'asset_id'] },
    { using: 'BRIN', fields: ['timestamp'] }
  ]
});

module.exports = Transaction;