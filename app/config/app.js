const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

module.exports = {

    app_name: process.env.APP_NAME,

    app_port: process.env.APP_PORT,

    app_url: process.env.APP_URL,

    otp_attempt: 3,
    otp_expire_after: 5, // 5 min


    db: {
        mysql: {
            db_host: process.env.MYSQL_HOST,
            db_port: process.env.MYSQL_PORT,
            db_name: process.env.MYSQL_NAME,
            db_user: process.env.MYSQL_USER,
            db_pass: process.env.MYSQL_PASS
        },

        mongo: {

        },

        redis: {

        }
    }
}