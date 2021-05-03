const configs = require('./app')

const mysqlCredentials = configs.db.mysql

const mysql = require('mysql')

const connection = mysql.createConnection({

    host    : mysqlCredentials.db_host,
    user    : mysqlCredentials.db_user,
    password: mysqlCredentials.db_pass,
    database: mysqlCredentials.db_name,
    port    : mysqlCredentials.db_port,
    charset : "utf8"

})

// connection.connect()


module.exports = connection;