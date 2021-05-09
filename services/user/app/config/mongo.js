const configs = require('./app')

const mongoose = require('mongoose')

const mongoCredentials = configs.db.mongo

const connect = async () => {

    await mongoose.connect(mongoCredentials.connection_url, mongoCredentials.connection_options)
}

connect()

module.exports = mongoose;