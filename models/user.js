const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        avatarPath: String
    }
})

let user = mongoose.model('User', userSchema);

module.exports = user;

