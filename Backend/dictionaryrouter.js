const express = require('express')
const router = express.Router()
const dbDictionaries = require('./models/dictionaries')
const { Op } = require('sequelize')

// получить список данных в словаре
router.get('/dictionary/:type', async (req, res) => {
    try {
      const conditions = {              
        where:  {
          type: req.params.type
        },
        order: [
          ['order', 'asc']
        ]
      }

      const dictionaries = await dbDictionaries.findAll(conditions)
      res.status(200).json(
        dictionaries
      )
    } catch (error) {
      res.status(500).json({
        error: error.message
      })
    }  
  })
  
module.exports = router