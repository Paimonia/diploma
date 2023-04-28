// Db
const { DataTypes } = require('sequelize')
const db = require('../db.js')

const dbExercises = db.define('exercises',  
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    calories_per_hour: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  // Опции
  {
    timestamps: false
  }
)

module.exports = dbExercises