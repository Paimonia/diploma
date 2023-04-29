const express = require('express')
const router = express.Router()
const db = require('./db')
const dbTrainings = require('./models/trainings')
const dbTrainingsExercises = require('./models/trainingsexercises')
const { Op } = require('sequelize')
const fs = require('fs')

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
  
// создать или обновить тренировку
const createorupdate = async (req, res, id) => {
  console.log(req.body)
  
  let training 
  if (id) {
    
    // получаю тренировку
    training = await dbTrainings.findOne({
      where:  {
        id: id
      }
    })

    if (!training) {
      throw new Error('Тренировка по id не найдена')
    }

    // обновляю поля записи в базе
    await dbTrainings.update({
      name:  req.body.name,
      description: req.body.description,
      repeat_count: +req.body.repeat_count ?? 1,
      repeat_rest_time: +req.body.repeat_rest_time ?? 60
    }, {
      where: { id : id}
    })   

    // удаляю привязки к словарикам (они будут пересозданы)
    /*await dbTrainingsDictionaries.destroy({
      where: { exercise_id: id }
    })*/

  } else
  {
    // создаю новую тренировку
    training = await dbTrainings.create({
      name: req.body.name,
      description: req.body.description,
      repeat_count: +req.body.repeat_count ?? 1,
      repeat_rest_time: +req.body.repeat_rest_time ?? 60,
      user_id: req.body.user_id
    })  
  }

  // привязываю к упражнению проставленные флаги/checkbox'ы      
  /*Object.keys(req.body)
    .filter((k) => k.startsWith('dic'))
    .map(k => {           
      dicid = +k.substring('dic'.length)          
      if (req.body[k] === 'on') {
        // добавляю связь между созданной записью о тренировке и записью в словаре
        dbTrainingsDictionaries.create({
          exercise_id: exercise.id,
          dictionary_id: dicid              
        })
      }
    })    
*/

  // сохраняю файл изображение (растр)
  if (req.body.file) {
    let base64data = ''      
    let extension = ''
          
    if (req.body.file.startsWith('data:image/jpeg;base64,')) {
      const headerLength = 'data:image/jpeg;base64,'.length
      base64data = req.body.file.substring(headerLength, req.body.file.length - headerLength)
      extension = 'jpg'
    } else {
      throw new Error('Неподдерживаемый тип файла изображения')
    }
    
    let outputFileName = __dirname + `\\images\\trainings\\${training.id}.${extension}`      
    fs.writeFileSync(outputFileName, base64data, 'base64')
  }
}


// создать новую тренировку
router.post('/training', async (req, res) => {
  try {
    createorupdate(req, res, null)      
    res.status(201).json(
      {}
    )
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      error: error.message
    })
  }  
})

// обновить тренировку
router.put('/training/:id', async (req, res) => {
  try {
    createorupdate(req, res, req.params.id)      
    res.status(200).json(
      {}
    )
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      error: error.message
    })
  }  
})

// удалить тренировку
router.delete('/training/:id', async (req, res) => {
  try {
    // удаляю файл изображения (если есть)
    const outputImageFileName = __dirname + `\\images\\trainings\\${req.params.id}.jpg`          
    if (fs.existsSync(outputImageFileName)) {
      fs.unlinkSync(outputImageFileName)
    }
    
    // удаляю записи о подвязанных тренировках
    await dbTrainingsExercises.destroy({
      where: { training_id: req.params.id }
    })

    // удаляю запись об упражнении
    await dbTrainings.destroy({
      where: { id: req.params.id }
    })

    res.status(201).json(
      {}
    )
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      error: error.message
    })
  }  
})


module.exports = router