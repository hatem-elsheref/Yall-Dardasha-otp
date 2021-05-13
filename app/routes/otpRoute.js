const { code, verify, getToken } = require('./../controllers/otpController')

const { allowedToAccess, otpPhoneValidator, otpCodeValidator } = require('./../middlewares/validatorMiddleware')

const { checkValidationError } = require('./../helpers/validatorError')

const express = require('express')

const otpRouter = express.Router()

otpRouter.post('/code', otpPhoneValidator(), checkValidationError, code)

otpRouter.post('/verify', otpCodeValidator(), checkValidationError, verify)

otpRouter.post('/get-token', allowedToAccess, function (req,res,next){
    if (('' + req.body.user_id).length == 0){
        return res.json({code: 400, message : 'please enter valid user id'})
    }

    next()
}, getToken)

module.exports = otpRouter;