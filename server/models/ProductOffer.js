const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductOffer = sequelize.define('ProductOffer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  offer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ProductOffers',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['product_id', 'offer_id'],
      name: 'unique_product_offer'
    }
  ]
});

module.exports = ProductOffer;
