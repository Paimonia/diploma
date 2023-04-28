const express = require('express')
const router = express.Router()
const db = require('./db')
const dbTrainings = require('./models/trainings')
const dbTrainingsExercises = require('./models/trainingsexercises')
const { Op } = require('sequelize')

// получить список тренировок пользователя
router.get('/training/available/:id', async (req, res) => {
    try {
      const trainingsconditions = {              
        where:  {
          user_id: req.params.id
        },
        order: [
          ['creation_date', req.query.order ?? 'desc']
        ]
      }

         // если задана фильтрация
         if (req.query.filter) {
          trainingsconditions.where = {
            ...trainingsconditions.where, 
            name: {
              [Op.iLike]: '%' + req.query.filter + '%'
            } }
        }

      const trainings = await dbTrainings.findAll(trainingsconditions)      
      const exporttrainings = []
      for (const training of trainings) {        
      
        // для тренировки запрашиваю информацию по её упражнениям
        const [results, metadata] = await db.query("SELECT e.title, e.description, e.calories_per_hour, te.work_time, te.worked_time, te.order, te.completion_rest_time FROM trainings_exercises te JOIN exercises e ON te.exercise_id = e.id WHERE te.training_id = :id ORDER BY te.order",
          {
            replacements: { id: training.id }
          }
        )        

        exporttrainings.push({
          ...training.dataValues,
          exercises: results
        })        
      }
      
      res.status(200).json( 
        exporttrainings       
      )
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }  
  })
  
module.exports = router