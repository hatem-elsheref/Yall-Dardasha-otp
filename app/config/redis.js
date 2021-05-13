const configs = require('./app')

const redis = require('redis');

//creates a new client
// module.exports = redis.createClient(configs.db.redis.port, configs.db.redis.host)
const config = 'redis://default:YMyNVOx4Yn6Ag32n7u3Ci1mV3UyUuAFr@redis-13625.c10.us-east-1-3.ec2.cloud.redislabs.com:13625'
module.exports = redis.createClient(config)




