const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
mongoose.connect("mongodb://localhost:27017/paytm");

const userSchema = new Schema({
        email: {type: String, unique: true},
        password: String,
        firstName: String,
        lastName: String
})

const userModel = mongoose.model('user', userSchema);

module.exports = {
    userModel
}