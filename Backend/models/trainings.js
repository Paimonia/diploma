// Db
const { DataTypes } = require('sequelize')
const db = require('../db.js')

const dbTrainings = db.define('trainings',  
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    repeat_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    repeat_rest_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  // Опции
  {
    timestamps: false
  }
)

module.exports = dbTrainings