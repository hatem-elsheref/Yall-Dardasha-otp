const configs = require('./app')

const mysqlCredentials = configs.db.mysql

const mysql = require('mysql')

const connection = mysql.createConnection('mysql://p2far3f59ryfm287:oz4d4u0fd432ukoa@bmlx3df4ma7r1yh4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/lb05onifh0ulceie')
// const connection = mysql.createConnection({

//     host    : mysqlCredentials.db_host,
//     user    : mysqlCredentials.db_user,
//     password: mysqlCredentials.db_pass,
//     database: mysqlCredentials.db_name,
//     port    : mysqlCredentials.db_port,
//     charset : "utf8"

// })

// connection.connect()


module.exports = connection;