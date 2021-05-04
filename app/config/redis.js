const configs = require('./app')

const redis = require('redis');

//creates a new client
const client = redis.createClient(configs.db.redis.port, configs.db.redis.host)

module.exports = client.createClient(configs.db.redis.port, configs.db.redis.host)




