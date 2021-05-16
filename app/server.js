const configurations = require('./config')
const redisClient = require('./redisConnection')
const mysqlClient = require('./mysqlConnection')

const currentEnvironment = configurations.devEnvironment ? configurations.development : configurations.production

const express = require('express')

const bodyParser = require('body-parser')

const otpService = require('./routes/otpRoute')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/v1/otp', otpService)


app.get('/about-service', function (request, response) {
    return response.send('Hello Yalla Dardasha  / service-name : ' + configurations.serviceName + ', service-description : ' + configurations.serviceDescription);
})
app.get('/reset-service', async function (request, response) {


    let query = 'DELETE FROM otp'

    await mysqlClient.query(query, (error, results) => {})

    await redisClient.flushdb( function (err, succeeded) {});

    return response.json('redis && mysql db removed')

})


app.get('/all', async function (request, response) {


    let query = 'SELECT * FROM otp'

     mysqlClient.query(query, (error, results) => {
        return response.json(results)
    })

})


app.listen(currentEnvironment.port, function () {
    console.log(`application running in ${currentEnvironment.url}`);
});