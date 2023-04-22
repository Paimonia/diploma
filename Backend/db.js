const Sequilize = require('sequelize')

module.exports = new Sequilize('aksntwgd', 'aksntwgd', 'LXyur9Gkj8BnVAJOuoWsNGhOSMR9V86f', {
  host: 'baasu.db.elephantsql.com',
  dialect: 'postgres',
  operatorsAliases: 0,
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000
  }
})