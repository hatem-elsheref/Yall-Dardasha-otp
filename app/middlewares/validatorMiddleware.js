const { body, check } = require('express-validator')

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