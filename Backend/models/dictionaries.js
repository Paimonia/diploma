// Db
const { DataTypes } = require('sequelize')
const db = require('../db.js')

const dbDictionaries = db.define('dictionaries',  
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  // Опции
  {
    timestamps: false
  }
)

module.exports = dbDictionaries