// models/Inquiry.js

const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    recipientEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    senderName: {
        type: String,
        required: true,
        trim: true
    },
    senderEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
