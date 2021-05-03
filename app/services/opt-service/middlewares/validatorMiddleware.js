
const validator = require('express-validator')

const Response = require('../../../response')

module.exports.otpPhoneValidator = (request, response, next) => {

    validator.body('phone').isMobilePhone('ar-EG')

    const errors = validator.validationResult(request)

    if (!errors.isEmpty()) {
        response.status(400)
        return response.status(400).json(Response(400, 'failed', errors.errors[0].msg, [], errors.array()))
    }
    next()
}