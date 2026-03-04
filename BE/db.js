const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
//console.log(`${process.env.MONGODB_URL}`);

mongoose.connect(`${process.env.MONGODB_URL}`);

const userSchema = new Schema({
        email: {type: String, unique: true},
        password: String,
        firstName: String,
        lastName: String
})

const accountSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
}