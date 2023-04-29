const express = require('express')
const router = express.Router()
const dbExercises = require('./models/exercises')
const dbExercisesDictionaries = require('./models/exercisesdictionaries')
const { Op } = require('sequelize')
const fs = require('fs')

router.get('/exercise/:id', async (req, res) => {
  try {
      // проверяю, есть ли такой пользователь перед созданием
      const exercise = await dbExercises.findOne({
        where:  {
          id: req.params.id
        }
      })

      if (!exercise) {
        res.status(404).json({
          error: "Упражнение не найдено"
        })
        return
      }

      // подгружаю галочки               
      const conditions =  {
        where: {
          exercise_id: req.params.id
        }
      }
  
      const exercises = await dbExercisesDictionaries.findAll(conditions)        
      const fullexercise = {...exercise.dataValues, dicRefs: [] }
      exercises.map(e => fullexercise.dicRefs.push(e.dictionary_id))
      
      res.status(200).json(
        fullexercise
      )

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  } 
})

// получить список упражнений, доступных для пользователя
router.get('/exercise/available/:userid', async (req, res) => {
    try {      
      const conditions = {              
        where:  {
          user_id: {
            [Op.or]: [req.params.userid, null]
          }            
        },
        order: [
          ['creation_date', req.query.order]
        ]
      }

      // если задана фильтрация
      if (req.query.filter) {
        conditions.where = {
          ...conditions.where, 
          title: {
            [Op.iLike]: '%' + req.query.filter + '%'
          } }
      }

      const exercises = await dbExercises.findAll(conditions)
      res.status(200).json(
        exercises
      )
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }  
  })

// удалить упражнение
router.delete('/exercise/:id', async (req, res) => {
  try {
    // удаляю файл изображения (если есть)
    const outputImageFileName = __dirname + `\\images\\exercises\\${req.params.id}.jpg`          
    if (fs.existsSync(outputImageFileName)) {
      fs.unlinkSync(outputImageFileName)
    }

    // удаляю файл видео (если есть)
    const outputVideoFileName = __dirname + `\\videos\\exercises\\${req.params.id}.mp4`
    if (fs.existsSync(outputVideoFileName)) {
      fs.unlinkSync(outputVideoFileName)
    }

    // удаляю записи о подвязанных значениях словарей
    await dbExercisesDictionaries.destroy({
      where: { exercise_id: req.params.id }
    })

    // удаляю запись об упражнении
    await dbExercises.destroy({
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

// создать или обновить упражнение
const createorupdate = async (req, res, id) => {
  console.log(req.body)
  
  let exercise 
  if (id) {
    
    // получаю упражнение
    exercise = await dbExercises.findOne({
      where:  {
        id: id
      }
    })

    if (!exercise) {
      throw new Error('Упражнение по id не найдено')
    }

    // обновляю поля записи в базе
    await dbExercises.update({
      title:  req.body.title,
      description: req.body.description,
      calories_per_hour: parseInt(req.body.calories_per_hour) ?? 0      
    }, {
      where: { id : id}
    })   

    // удаляю привязки к словарикам (они будут пересозданы)
    await dbExercisesDictionaries.destroy({
      where: { exercise_id: id }
    })

  } else
  {
    // создаю упражнение
    exercise = await dbExercises.create({
      title: req.body.title,
      description: req.body.description,
      calories_per_hour: parseInt(req.body.calories_per_hour) ?? 0,        
      creation_date: new Date(),
      user_id: req.body.user_id
    })  
  }

  // привязываю к упражнению проставленные флаги/checkbox'ы      
  Object.keys(req.body)
    .filter((k) => k.startsWith('dic'))
    .map(k => {           
      dicid = +k.substring('dic'.length)          
      if (req.body[k] === 'on') {
        // добавляю связь между созданной записью об упражении и записью в словаре
        dbExercisesDictionaries.create({
          exercise_id: exercise.id,
          dictionary_id: dicid              
        })
      }
    })    

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
    
    let outputFileName = __dirname + `\\images\\exercises\\${exercise.id}.${extension}`      
    fs.writeFileSync(outputFileName, base64data, 'base64')
  }

  // сохраняю файл изображение (видео)
  if (req.body.video) {
    let base64data = ''      
    let extension = ''
        
    if (req.body.video?.startsWith('data:video/mp4;base64,')) {
      const headerLength = 'data:video/mp4;base64,'.length
      base64data = req.body.video.substring(headerLength, req.body.video.length - headerLength)
      extension = 'mp4'
    } else {
      throw new Error('Неподдерживаемый тип файла видео')
    }
    
    const outputFileName = __dirname + `\\videos\\exercises\\${exercise.id}.${extension}`      
    fs.writeFileSync(outputFileName, base64data, 'base64')
  }
}

// создать новое упражнение
router.post('/exercise', async (req, res) => {
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

// обновить упражнение
router.put('/exercise/:id', async (req, res) => {
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


module.exports = router