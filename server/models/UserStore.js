const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserStore = sequelize.define('UserStore', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  store_id: {
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
  tableName: 'UserStores',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'store_id'],
      name: 'unique_user_store'
    }
  ]
});

module.exports = UserStore;
