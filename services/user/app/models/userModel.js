const mongooseConnection = require('./../config/mongo')

const Schema = mongooseConnection.Schema;

const User = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, index: true, unique: true },
    avatar: { type: String, required: false },
    phone: { type: String, max: 16, index: true, unique: true },
    bio: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
    created_at: { type: Date, default: Date.now },
});



module.exports = mongooseConnection.model('User', User);
