// Db
const { DataTypes } = require('sequelize')
const db = require('../db.js')

const dbTrainingsExercises = db.define('trainings_exercises',  
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    training_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    work_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    worked_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    completion_rest_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  // Опции
  {
    timestamps: false
  }
)

module.exports = dbTrainingsExercises