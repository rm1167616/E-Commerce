const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/database");

const UserProduct = sequelize.define('UserProduct', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'UserProducts',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id'],
      name: 'unique_user_product'
    }
  ]
});

module.exports = UserProduct;
