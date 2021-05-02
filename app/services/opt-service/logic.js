
const databaseHandler = require('../../config/mysql')
const { otp_attempt: otpAttempt, otp_expire_after: otpExpireAfter } = require('../../config/app')

const Response = require('../../response')

const validator = require('express-validator')

const Otp = require('./models/Otp')


const express = require('express')
const bodyParser = require('body-parser')


const otpRouter = express.Router()
otpRouter.use(bodyParser.json())
otpRouter.use(bodyParser.urlencoded({ extended: true }))

otpRouter.post('/code', validator.body('phone').isMobilePhone('ar-EG'), (request, response) => {

    const errors = validator.validationResult(request);

    if (!errors.isEmpty()) {
        response.status(400)
        return response.status(400).json(Response(400, 'failed', errors.errors[0].msg, [], errors.array()))
    }


    const otpModel = new Otp(databaseHandler, otpAttempt, otpExpireAfter)

    otpModel.setMobilePhone(request.body.phone)

    let result = otpModel.code()
    console.log(result);
    if (result === 100) {
        return response.json(Response(200, 'sorry', 'try again', [], []))
    } else if (result === 200) {
        return response.json(Response(200, 'ok', 'code sent successfully', request.body.phone, []))
    } else if (result === 300){
        return response.json(Response(200, 'sorry', 'your number blocked try again after 24 hours', [], []))
    }else{
        return response.json(Response(500,'server error'))
    }


})


otpRouter.post('/verify', (request, response) => {

    response.send('verify route')

})


module.exports = otpRouter;