
const databaseHandler = require('./app/config/mysql')
const { otp_attempt: otpAttempt, otp_expire_after: otpExpireAfter } = require('./app/config/app')

const Response = require('./app/response')

const validator = require('express-validator')

const { code, verify } = require('./app/services/opt-service/models/OtpModel')
const phoneValidator = require('./app/services/opt-service/middlewares/validatorMiddleware')
const phoneValidator = require('./controllers/')


const express = require('express')
const bodyParser = require('body-parser')


const otpRouter = express.Router()

otpRouter.use(bodyParser.json())
otpRouter.use(bodyParser.urlencoded({ extended: true }))

otpRouter.post('/code', phoneValidator, (request, response) => {




    const otpModel = new Otp(databaseHandler, otpAttempt, otpExpireAfter)

    otpModel.setMobilePhone(request.body.phone)

    let result = otpModel.code()
    console.log(result);
    if (result === 100) {
        return response.json(Response(200, 'sorry', 'try again', [], []))
    } else if (result === 200) {
        return response.json(Response(200, 'ok', 'code sent successfully', request.body.phone, []))
    } else if (result === 300) {
        return response.json(Response(200, 'sorry', 'your number blocked try again after 24 hours', [], []))
    } else {
        return response.json(Response(500, 'server error'))
    }


})


otpRouter.post('/verify', (request, response) => {

    response.send('verify route')

})


module.exports = otpRouter;