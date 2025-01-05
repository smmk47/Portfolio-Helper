// models/Contact.js

const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    fromEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const ContactSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    primaryEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    linkedIn: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    },
    huggingFace: {
        type: String,
        trim: true
    },
    inquiries: [InquirySchema]
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
