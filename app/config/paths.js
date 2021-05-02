const path = require('path')


module.exports = {
    app_path: path.join(__dirname, '..'),
    config_path: path.join(__filename, '..', 'config'),
    service_path: path.join(__dirname, '..', 'services')
}


