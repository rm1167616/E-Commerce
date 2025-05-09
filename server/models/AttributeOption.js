const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AttributeOption = sequelize.define('AttributeOption', {
  option_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  attribute_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'AttributeOptions',
  timestamps: false
});

module.exports = AttributeOption;
