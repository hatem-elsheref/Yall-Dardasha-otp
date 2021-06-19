module.exports = {
    serviceName : 'otp service',
    serviceDescription : 'otp service for generate code , verify code, call redis',
    apiKey : '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
    jwt : {
        secret : 'W7bwoFsqizrvyDUfQxdgSB2tN6JAmCYK',
        options: {
            expiresIn: '24h',
            algorithm: 'HS256'
        },
        refreshToken : '30d'
    },
    otpAttempt: 5, // 100 for test //3 number of tries ber day
    otpExpireAfter: 5, //1440 day for test // in minutes
    development : {
        port : 3000,
        url : 'http://localhost:3000',
        redis : 'redis://127.0.0.1:6379',
        mysql : 'mysql://hatem:webserver@localhost:3306/gp_clubhouse'
    },
    production : {
        port : process.env.PORT,
        url : 'https://yalla-dardasha-otp.herokuapp.com',
        redis : 'redis://default:YMyNVOx4Yn6Ag32n7u3Ci1mV3UyUuAFr@redis-13625.c10.us-east-1-3.ec2.cloud.redislabs.com:13625',
        mysql : 'mysql://p2far3f59ryfm287:oz4d4u0fd432ukoa@bmlx3df4ma7r1yh4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/lb05onifh0ulceie'
    },

    devEnvironment : true
}
