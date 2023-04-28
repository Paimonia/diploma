// Db
const { DataTypes } = require('sequelize')
const db = require('../db.js')

const dbExercisesDictionaries = db.define('exercises_dictionaries',  
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dictionary_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  // Опции
  {
    timestamps: false
  }
)

module.exports = dbExercisesDictionaries