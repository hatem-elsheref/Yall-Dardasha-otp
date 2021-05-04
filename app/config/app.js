const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

module.exports = {

    app_name: process.env.APP_NAME,

    app_port: process.env.APP_PORT,

    app_url: process.env.APP_URL,

    otp_attempt: 3,

    otp_expire_after: 5,  //in min

    db: {
        mysql: {
            db_host: process.env.MYSQL_HOST,
            db_port: process.env.MYSQL_PORT,
            db_name: process.env.MYSQL_NAME,
            db_user: process.env.MYSQL_USER,
            db_pass: process.env.MYSQL_PASS
        },

        mongo: {
            connection_url: process.env.MONGO_URL,
            connection_options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            }

        },

        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        }
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'W7bwoFsqizrvyDUfQxdgSB2tN6JAmCYK',
        options: {
            expiresIn: '24h',
            algorithm: 'HS256'
        }
    }
}