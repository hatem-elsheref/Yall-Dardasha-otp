const configs = require('./config')

const redis = require('redis')

module.exports = redis.createClient(configs.devEnvironment ? configs.development.redis : configs.production.redis)




