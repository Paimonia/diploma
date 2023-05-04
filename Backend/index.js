const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const userrouter = require('./userrouter')
const exerciserouter = require('./exerciserouter')
const dictionaryrouter = require('./dictionaryrouter')
const trainingrouter = require('./trainingrouter')

const app = express()
app.use(cors())
app.use(bodyParser.json({limit: '70mb'}))

app.use("/images", express.static('images'))
app.use("/videos", express.static('videos'))
app.use(userrouter)
app.use(exerciserouter)
app.use(dictionaryrouter)
app.use(trainingrouter)

const port = 4000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})