const fetch = require('node-fetch');

var customs = {}
var options = {
    body: {
        verification_code: 4967,
        phone_number: '+201012345678' // +821012345678
    }
}



// url = 'https://www.clubhouseapi.com/api/resend_phone_number_auth'
url = 'https://www.clubhouseapi.com/api/complete_phone_number_auth'

options = options || {}
customs = customs || {}
options.headers = options.headers || {}

// NOTE: Clubhouse;
options.headers['User-Agent'] = customs.userAgent || 'clubhouse/297 (iPhone; iOS 14.4; Scale/2.00)'
options.headers['CH-Languages'] = customs.languages || 'en-US'
options.headers['CH-Locale'] = customs.locale || 'en_US'
options.headers['CH-AppVersion'] = customs.appVersion || '0.1.27'
options.headers['CH-AppBuild'] = customs.appBuild || '297'
options.headers['CH-DeviceId'] = customs.deviceId || '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'.toUpperCase()
options.headers['CH-UserID'] = customs.userId || '(null)'

if (customs.token) {
    options.headers.Authorization = 'Token ' + customs.token
}
// NOTE: Application;
options.headers.Accept = customs.accept || 'application/json'
options.headers['Accept-Encoding'] = customs.acceptEncodings || 'gzip, deflate, br'
options.headers['Accept-Language'] = customs.acceptLanguages || 'en-US;q=1'
// NOTE: Specification;
options.headers.Connection = 'keep-alive'
options.headers.Host = 'www.clubhouseapi.com'

// NOTE: Body;
if (!customs._preventBodySerialization && typeof options.body === 'object') {
    options.method = 'POST'
    options.headers['Content-Type'] = 'application/json; charset=utf-8'
    options.body = JSON.stringify(options.body)
}

// NOTE: Querystring;
if (options.query) {
    if (typeof options.query === 'object') {
        options.query = qs.stringify(options.query)
    }

    url += '?' + options.query

    delete options.query
}

// NOTE: Additionals;
options = {
    ...options,
    ...customs.fetchOptions
}

return fetch(url, options).then(res => res.text())
    .then(text => console.log(text))