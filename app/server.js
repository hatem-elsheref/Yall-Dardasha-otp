const configurations = require('./config')

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


app.listen(currentEnvironment.port, function () {
    console.log(`application running in ${currentEnvironment.url}`);
});