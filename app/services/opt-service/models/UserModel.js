const mongooseConnection = require('../../../config/mongo')

const Schema = mongooseConnection.Schema;

const User = new Schema({
    phone: { type: String, max: 16, index: true, unique: true },
    created_at: { type: Date, default: Date.now },
});



module.exports = mongooseConnection.model('User', User);
