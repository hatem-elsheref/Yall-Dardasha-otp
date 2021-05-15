const databaseHandler = require('./../mysqlConnection')

const { otpAttempt, otpExpireAfter, jwt } = require('./../config')

const JWT = require('jsonwebtoken')

const redis = require('./../redisConnection')

const { otpCode, otpVerify} = require('./../models/OtpModel')

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

module.exports.refresh = async (request, response) => {
    try {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            await JWT.verify(token, jwt.secret, {...jwt.options, expiresIn: jwt.refreshToken}, async (err, user) => {
                if (err) {
                    return response.status(403).json({code : 403, message: 'expired token'});
                }

                let deviceType = request.body.device || 'android-phone'
                let payload = { user_id: user.user_id, device_type: deviceType }
                const userToken = await JWT.sign(payload, jwt.secret, jwt.options)


               await redis.smembers('user_' + payload.user_id, function (err, rep){
                    rep.forEach((val) =>{
                        let data = JSON.parse(val)
                        if (data.device === deviceType){
                            redis.srem('user_' + payload.user_id, val)
                        }
                    })

                })

                await redis.sadd('user_' + payload.user_id, JSON.stringify({ token: userToken, device: deviceType }));


                return response.json({code : 200, token: userToken})

            });} else {
            return response.status(403).json({code : 403, message: 'no token'});
        }
    }catch (Error){
        return response.status(403).json({code : 403, message: 'expired token'});
    }
}
