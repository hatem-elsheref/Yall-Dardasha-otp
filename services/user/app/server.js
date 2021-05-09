const config = require('./config/app')

const express = require('express')

const bodyParser = require('body-parser')

const userService = require('./routes/userRoute')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth/user', userService)


app.listen(config.app_port, function () {
    console.log(`application running in ${config.app_url}:${config.app_port}`);
});