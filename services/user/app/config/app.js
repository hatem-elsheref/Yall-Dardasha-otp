const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

module.exports = {

    app_name: process.env.APP_NAME,

    app_port: process.env.APP_PORT,

    app_url: process.env.APP_URL,

    services_api_key: process.env.API_KEY || '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    db: {

        mongo: {

            connection_url: process.env.MONGO_URL,
            connection_options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            }


        }
    }
}