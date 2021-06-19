const { code, verify, refresh, verifyToken } = require('./../controllers/otpController')

const { otpPhoneValidator, otpCodeValidator } = require('./../middlewares/validatorMiddleware')

const { checkValidationError } = require('./../helpers/validatorError')

const express = require('express')

const otpRouter = express.Router()

otpRouter.post('/code', otpPhoneValidator(), checkValidationError, code)

otpRouter.post('/verify', otpCodeValidator(), checkValidationError, verify)

otpRouter.post('/refresh', refresh)

otpRouter.post('/verify-redis', verifyToken)


module.exports = otpRouter;
