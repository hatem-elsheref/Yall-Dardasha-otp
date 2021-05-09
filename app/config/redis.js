const configs = require('./app')

const redis = require('redis');

//creates a new client
module.exports = redis.createClient(configs.db.redis.port, configs.db.redis.host)




