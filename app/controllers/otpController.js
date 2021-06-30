const databaseHandler = require('./../mysqlConnection')

const { otpAttempt, otpExpireAfter, jwt } = require('./../config')

const JWT = require('jsonwebtoken')

const redis = require('./../redisConnection')

const { otpCode, otpVerify } = require('./../models/OtpModel')

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

module.exports.logout = async (request, response) => {
    try {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            await JWT.verify(token, jwt.secret, jwt.options, async (error, user) => {
                if (error)
                    return response.status(403).json({ status: false, message: 'expired token' });

                let deviceType = request.body.device || 'android-phone';
                await redis.smembers('user_' + user.user_id, async (err, tokens) => {
                    if (!err && tokens.length > 0) {
                        await tokens.forEach((val) => {
                            let data = JSON.parse(val)
                            if (data.device === deviceType) {
                                redis.srem('user_' + user.user_id, val)
                            }
                        })
                    }

                    return response.json({ message: "loged out successfully" })

                });
            });

        } else {
            return response.status(403).json({ status: false, message: "token not found" });
        }
    } catch (Error) {
        return response.status(403).json({ status: false, message: "token expired" });
    }

}



module.exports.refresh = async (request, response) => {
    try {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];

            await JWT.verify(token, jwt.secret, { ...jwt.options, expiresIn: jwt.refreshToken }, async (err, user) => {
                if (err) {
                    return response.status(403).json({ code: 403, message: 'expired token' });
                }

                let deviceType = request.body.device || 'android-phone'
                let payload = { user_id: user.user_id, device_type: deviceType }
                const userToken = await JWT.sign(payload, jwt.secret, jwt.options)


                await redis.smembers('user_' + payload.user_id, function (err, rep) {
                    rep.forEach((val) => {
                        let data = JSON.parse(val)
                        if (data.device === deviceType) {
                            redis.srem('user_' + payload.user_id, val)
                        }
                    })

                })

                await redis.sadd('user_' + payload.user_id, JSON.stringify({ token: userToken, device: deviceType }));


                return response.json({ code: 200, token: userToken })

            });
        } else {
            return response.status(403).json({ code: 403, message: 'no token' });
        }
    } catch (Error) {
        return response.status(403).json({ code: 403, message: 'expired token' });
    }
}

module.exports.verifyToken = async (request, response) => {
    try {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            await JWT.verify(token, jwt.secret, jwt.options, async (error, user) => {
                if (error)
                    return response.status(403).json({ status: false, message: 'expired token' });

                let deviceType = request.body.device || 'android-phone';
                await redis.smembers('user_' + user.user_id, async (err, tokens) => {
                    let redisTokens = []

                    if (!err && tokens.length > 0) {
                        await tokens.forEach((val) => {
                            let data = JSON.parse(val)
                            if (data.device === deviceType) {
                                redisTokens.push(data.token)
                            }
                        })
                    }

                    if (redisTokens.includes(token)) {
                        return response.status(200).json({ status: true, message: "token valid", user: user.user_id });
                    } else {
                        return response.status(403).json({ status: false, message: "token expired" });
                    }
                });
            });

        } else {
            return response.status(403).json({ status: false, message: "token not found" });
        }
    } catch (Error) {
        return response.status(403).json({ status: false, message: "token expired" });
    }

}
