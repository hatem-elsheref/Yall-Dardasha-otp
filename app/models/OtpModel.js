const { jwt : jwtConfigs, apiKey, devEnvironment} = require('./../config')

const redis = require("./../redisConnection")

const fetch = require('node-fetch')

const Response = require('./../helpers/response')

const JWT = require('jsonwebtoken');

const table = 'otp';

const generateCode = function () {

    return '555555' // for test

    return '' +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10)
}

function getByPhoneNumber(connection, phoneNumber) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table + ' WHERE phone = ? ' // LIMIT 1
        connection.query(query, [phoneNumber], (error, results) => { return error ? resolve(100) : resolve(results) })
    })
}

function getByPhoneNumberAndCode(connection, phoneNumber, code) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM ' + table + ' WHERE phone = ? AND otp_code = ? ' //LIMIT 1
        connection.query(query, [phoneNumber, code], (error, result) => { return error ? resolve(100) : resolve(result) })
    })
}

function resetTriesNumberToZero(connection, phoneNumber) {
    return new Promise((resolve, reject) => {

        /*
        console.log('time between now and last code > 24 hours then reset the tries and send new code');
        */

        let query = 'UPDATE ' + table + 'SET tries = ? WHERE phone = ?'

        connection.query(query, [0, phoneNumber], function (error) { return error ? resolve(true) : resolve(false) })
    })
}

function create(connection, phoneNumber) {
    return new Promise((resolve, reject) => {

        let code = generateCode()

        let values = { otp_code: code, phone: phoneNumber, tries: 1, send_at: (new Date()).getTime() }

        let query = 'INSERT INTO ' + table + ' SET ?'

        connection.query(query, values, function (error) { error ? console.log(error) : ''; return error ? resolve(100) : resolve(200) })

    })
}

function update(connection, phoneNumber, tries) {
    return new Promise((resolve, reject) => {

        // update +1 of tries

        let code = generateCode()

        let values = { otp_code: code, tries: tries, send_at: (new Date()).getTime() }


        let query = 'UPDATE ' + table + ' SET ? WHERE phone = ?'


        connection.query(query, [values, phoneNumber], function (error) { /*error ? console.log(error) : console.log('tmt');*/ return error ? resolve(100) : resolve(200) })
    })
}

const allowedToGenerateNewCode = async function (connection, record, phone, tries) {


    let lastMessageSentAt = record.send_at

    let currentTime = (new Date()).getTime()

    let h24 = 60 * 60 * 24
    /*
    let h24 = 24 // for test
    */


    if (((currentTime - lastMessageSentAt) / 1000) < h24) {

        // at the same day and completed the all available triess => not allowed

        /*
        console.log('[ at the same day ] time between now and last sent code < 24 hours');
        console.log('if true not exceded the allowed number of tries ' + (record.tries + 1) + '/' + tries);
        console.log('if false sorry,  exceded the allowed number of tries ' + (record.tries + 1) + '/' + tries);
        */

        return ((parseInt(record.tries) + 1) <= tries);

    } else {
        // not at the same day (more than 24 h from last sent code) reset the tries to zero => allowed
        return await resetTriesNumberToZero(connection, phone)
    }
}

// generate code and save it in db and send to user in sms
// input mobile number
module.exports.otpCode = async function (connection, phone, tries) {

    let response = await getByPhoneNumber(connection, phone)
    let rows = []

    if (Array.isArray(response))
        rows = response
    else
        return Response(response, 'fail', 'try again', [], [])


    if (rows.length > 0) {

        // user exists in otp table

        response = await allowedToGenerateNewCode(connection, rows[0], phone, tries)
        if (response === true) {
            // increment the tries number one step (+1)
            /*
            console.log('allowed to generate new code');
            */
            response = await update(connection, phone, rows[0].tries < tries ? rows[0].tries + 1 : 1)

            if (parseInt(response) === 100)
                return Response(response, 'fail', 'try again')
            else
                return Response(200, 'success', 'code sent successfully')
        } else {
            // not allowed to regenerate in current day try after 24 hours
            /*
             console.log('not allowed try after 24 h');
            */
            return Response(300, 'fail', 'your number blocked try again after 24 hours');
        }

    } else {
        // create new record
        response = await create(connection, phone)

        if (parseInt(response) === 100)
            return Response(response, 'fail', 'try again')
        else
            return Response(200, 'success', 'code sent successfully')
    }

}


// verify if the saved code equal the code in the request body
// input code and mobilePhone
module.exports.otpVerify = async function (connection, phone, code, expire, device) {

    let response = await getByPhoneNumberAndCode(connection, phone, code)

    let user = null

    if (Array.isArray(response) && response.length > 0)
        user = response[0]
    else
        return Response(Number.isInteger(response) ? response : 100, 'fail', 'invalid code or phone number not found', [], [])


    // here that mean that user and code exist so that we should validate expire date it must be less than or equal the default

    let lastMessageSentAt = user.send_at

    let currentTime = (new Date()).getTime()

    if (((currentTime - lastMessageSentAt) / 1000) <= expire * 60) { // then code valid

        let options = {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'API_KEY': apiKey
            },

            body: JSON.stringify({ phone: phone })
        }


        let api = '/api/v1/user/info'
        let userServiceResponse = null

        if (devEnvironment){
            userServiceResponse = await fetch( 'http://localhost:3001' + api, options).then(res => res.json())
        }else{
            userServiceResponse = await fetch('https://yalla-dardasha-user.herokuapp.com' + api, options).then(res => res.json())
        }


        // if user already registered before
        if (userServiceResponse.code === 200) {

            let deviceType = device || 'android-phone'
            let payload = { user_id: userServiceResponse.user._id, device_type: deviceType }
            // get jwt and start generate the token with the user id only
            const userToken = JWT.sign(payload, jwtConfigs.secret, jwtConfigs.options)

            // store in redis and return in response
            redis.sadd('user_' + userServiceResponse.user._id, JSON.stringify({ token: userToken, device: deviceType }));

            // return the token back to android and make endpoint to check if he is verified or not
            return Response(200, 'success', 'verified successfully', [{ token: userToken, accountVerified: userServiceResponse.accountVerified }], [])

        } else
            return Response(userServiceResponse.code ?? 500, 'fail', userServiceResponse.message ?? 'unknown error', [], [])

    } else {
        // code is expired
        return Response(300, 'fail', 'expired code', [], [])

    }


}
