const express = require('express')
const router = express.Router()
const db = require('./db')
const dbTrainings = require('./models/trainings')
const dbTrainingsExercises = require('./models/trainingsexercises')
const { Op } = require('sequelize')
const fs = require('fs')

// получить тренировку по id
router.get('/training/:id', async (req, res) => {
  try {
      // проверяю, есть ли такая тренировка
      const training = await dbTrainings.findOne({
        where:  {
          id: req.params.id
        }
      })

      if (!training) {
        res.status(404).json({
          error: "Тренировка не найдена"
        })
        return
      }

      // подгружаю привязанные упражнения               
      const conditions =  {
        where: {
          training_id: req.params.id
        }
      }
  
      const exercises = await dbTrainingsExercises.findAll(conditions)        
      const fulltraining = {...training.dataValues, exercises: [] }
      exercises.map(e => fulltraining.exercises.push(e))
      
      res.status(200).json(
        fulltraining
      )

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  } 
})

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

    // удаляю привязки к тренировкам (они будут пересозданы)
    await dbTrainingsExercises.destroy({
      where: { training_id: id }
    })

  } else
  {
    // создаю новую тренировку
    training = await dbTrainings.create({
      name: req.body.name,
      description: req.body.description,
      repeat_count: +req.body.repeat_count ?? 1,
      repeat_rest_time: +req.body.repeat_rest_time ?? 60,
      user_id: req.body.user_id,
      creation_date: new Date()
    })  

    id = training.id
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

  // создаю список упражнений
  console.log(req.body.exercises)
  req.body.exercises.forEach(async (e, i) =>  {
    console.log(id)
    await dbTrainingsExercises.create({
      training_id: id,
      exercise_id: e.exercise_id,
      work_time: e.work_time,
      worked_time: 0,
      order: i,
      completion_rest_time: e.completion_rest_time
    })
  });

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

// внести тренировку в план тренировок
router.post('/training/plan',  async (req, res) => {
  try {
       
    const trainingid = req.body.trainingid
    // необходимо клонировать тренировку и заполнить ей start_date
    // запрашиваю тренировку и её упражнения
    const training = await dbTrainings.findOne({
      where:  {
        id: trainingid
      }
    })

    if (!training) {
      res.status(404).json({
        error: "Тренировка не найдена"
      })
      return
    }

    // создаю новую тренировку (клонируя выбранную в качестве шаблона и заполняя дату начала)
    const clonetraining = await dbTrainings.create({
      name: training.dataValues.name,
      description: training.dataValues.description,
      repeat_count: training.dataValues.repeat_count,
      repeat_rest_time: training.dataValues.repeat_rest_time,
      user_id: training.dataValues.user_id,
      creation_date: new Date(),
      start_date: req.body.date
    })  

    const clonedtrainingid = clonetraining.dataValues.id
    
    // клонирую упражнения
    // подгружаю привязанные упражнения               
    const conditions =  {
      where: {
        training_id: trainingid
      }
    }

    const exercises = await dbTrainingsExercises.findAll(conditions)

    exercises.forEach(async (e, i) => {
      // клонирую упражнение
      await dbTrainingsExercises.create({
        training_id: clonedtrainingid,
        exercise_id: e.dataValues.exercise_id,
        work_time: e.dataValues.work_time,
        worked_time: 0,
        order: i,
        completion_rest_time: e.dataValues.completion_rest_time
      })
    })

    // клонирую изображение тренировки
    const trainingFile = __dirname + `\\images\\trainings\\${trainingid}.jpg`
    if (fs.existsSync(trainingFile)) {
      const clonedtrainingFile = __dirname + `\\images\\trainings\\${clonedtrainingid}.jpg`
      fs.copyFileSync(trainingFile, clonedtrainingFile)
    }

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