const otpController = require('./../controllers/otpController')
const otpMiddleware = require('./../middlewares/validatorMiddleware')

const express = require('express')

const otpRouter = express.Router()

otpRouter.post('/code', otpMiddleware.otpPhoneValidator, otpController.code)
otpRouter.post('/verify', otpMiddleware.otpPhoneValidator, otpController.verify)


module.exports = otpRouter;