const { body, check } = require('express-validator')


module.exports.otpPhoneValidator = () => {

    return [
        body('phone').isMobilePhone('ar-EG'),
        check('phone', 'phone field must be less than or equal 16 digits long ').matches(/^[0-9]{11,16}$/, "i"),
    ]

}

module.exports.otpCodeValidator = (request, response, next) => {

    return [
        check('code', 'code field must be 5 digits long ').matches(/^[0-9]{5}$/, "i")
    ]
}