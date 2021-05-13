const configs = require('./config')

const mysql = require('mysql')

module.exports = mysql.createConnection(configs.devEnvironment ? configs.development.mysql : configs.production.mysql)