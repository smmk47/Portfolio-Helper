// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String, // Path to the uploaded profile picture
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
