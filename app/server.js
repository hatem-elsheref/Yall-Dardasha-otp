const config = require('./config/app')

const express = require('express')

const bodyParser = require('body-parser')
const codeService = require('./services/opt-service/logic')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth', codeService)


app.get('/hi', (req, res) => {

    res.send('hi')
})




app.listen(config.app_port, function () {
    console.log(`application running in ${config.app_url}:${config.app_port}`);
});