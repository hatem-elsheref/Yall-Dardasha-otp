const databaseHandler = require('./../mysqlConnection')

const { otpAttempt, otpExpireAfter } = require('./../config')

const { otpCode, otpVerify , otpToken} = require('./../models/OtpModel')

module.exports.code = (request, response) => {
    otpCode(databaseHandler, request.body.phone, otpAttempt).then(status => {
        return response.json(status)
    })
}

module.exports.verify = (request, response) => {
    otpVerify(databaseHandler, request.body.phone, request.body.code, otpExpireAfter, request.body.device ?? null).then(status => {
        return response.json(status)
    })
}

module.exports.getToken = (request, response) => {
    otpToken(request.body.user_id, request.body.device).then(status => {
        return response.json(status)
    })
}