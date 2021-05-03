const Response = require('./response')
const { validationResult } = require('express-validator')

module.exports.checkValidationError = (request, response, next) => {

    let errors = validationResult(request)

    var extractedErrors = {}

    errors.array().map(function (err) {
        try {
            extractedErrors[err.param].push(err.msg)
        } catch (Error) {
            extractedErrors[err.param] = []
            extractedErrors[err.param].push(err.msg)
        }
    })

    if (!errors.isEmpty()) {
        return response.status(422).send(Response(422, 'fail', 'validation error', [], extractedErrors))
    }


    next()
}