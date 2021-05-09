const databaseHandler = require('./../config/mysql')

const { otp_attempt: otpAttempt, otp_expire_after: otpExpireAfter } = require('./../config/app')

const { otpCode, otpVerify } = require('./../models/OtpModel')

const Response = require('./../helpers/response')


module.exports.code = (request, response) => {

    otpCode(databaseHandler, request.body.phone, otpAttempt).then(status => {
        switch (status) {
            case 100:
                return response.json(Response(100, 'fail', 'try again', [], []))
            case 200:
                return response.json(Response(200, 'success', 'code sent successfully', request.body.phone, []))
            case 300:
                return response.json(Response(300, 'fail', 'your number blocked try again after 24 hours', [], []))
            default:
                return response.json(Response(400, 'fail', 'unknown error', [], []))

        }

    })

}

module.exports.verify = (request, response) => {

    otpVerify(databaseHandler, request.body.phone, request.body.code, otpExpireAfter, request.body.device ?? null).then(status => {

        return response.json(status)

    })

}