const express = require('express')
const router = express.Router()
const dbUsers = require('./models/users')

router.get('/user/token/:login/:password', async (req, res) => {
    try {
      // проверяю, есть ли такой пользователь перед созданием
      const user = await dbUsers.findOne({
        where:  {
          email: req.params.login,
          password: req.params.password
        }
      })
      if (!user) {
        res.status(404).json({
          error: "Пользователь/пароль нераспознаны"
        })
        return
      }
  
      res.status(200).json({
        id: user.id,
        token: '' // TODO jwt token
      })
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }  
  })
  
  router.get('/user/profile/:id', async (req, res) => {
    try {
      // пытаюсь получить пользователя по id
      const user = await dbUsers.findOne({
        where:  {
          id: req.params.id
        }
      })
      if (!user) {
        res.status(404).json({
          error: "Пользователя не существует"
        })
        return
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }  
  })
  
  router.post('/user/register', async (req, res) => {
    try {
      // проверяю, есть ли такой пользователь перед созданием
      const user = await dbUsers.findOne({
        where:  {
          email: req.body.login
        }
      })
      if (user) {
        res.status(400).json({
          error: "Пользователь уже существует"
        })
        return
      }
  
      // создаю пользователя 
      var result = await dbUsers.create({
        email: req.body.login,
        password: req.body.password,
        firstname: '',
        lastname: ''
      })  
  
      res.status(201).json({ 
        id: result.dataValues.id,
        token: '' // TODO jwt token
      })
      
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }  
  })
  
  router.put('/user/profile', async (req, res) => {
    try {
      // обновляю пользователя
      const user = await dbUsers.update(
        {        
          email: req.body.login,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        },
        {
          where: { id: req.body.userId }
        })
          
      res.status(200).end()
      
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }  
  })
  

module.exports = router