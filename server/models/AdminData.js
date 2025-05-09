const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdminData = sequelize.define(
  "AdminData",
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    security_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validate_period: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "AdminData",
    timestamps: false,
  }
);

module.exports = AdminData;
