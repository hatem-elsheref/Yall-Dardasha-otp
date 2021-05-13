const { body, check } = require('express-validator')

const {apiKey} = require('./../config')

module.exports.allowedToAccess = (request, response, next) => {
    try {
        if (request.headers["api_key"] !== apiKey){
            return response.json({code : 401, user : null, message : 'not allowed to access this resource'})
        }
    }catch (Error){
        return response.json({code : 401, user : null, message : 'not allowed to access this resource'})
    }

    next()
}

module.exports.otpPhoneValidator = () => {

    return [
        body('phone').isMobilePhone('ar-EG'),
        check('phone', 'phone field must be less than or equal 16 digits long ').matches(/^[0-9]{11,16}$/, "i"),
    ]

}

module.exports.otpCodeValidator = () => {

    return [
        body('phone').isMobilePhone('ar-EG'),
        check('phone', 'phone field must be less than or equal 16 digits long ').matches(/^[0-9]{11,16}$/, "i"),
        check('code', 'code field must be 6 digits long ').matches(/^[0-9]{6}$/, "i")

    ]
}