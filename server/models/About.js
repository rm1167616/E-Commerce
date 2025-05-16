const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const About = sequelize.define(
  "About",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Stores",
        key: "store_id",
      },
    },
  },
  {
    tableName: "About",
    timestamps: false,
  }
);

module.exports = About;
