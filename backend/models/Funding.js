// models/Funding.js

const mongoose = require('mongoose');

const FundingSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    agency: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    projectTimeline: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    type: {
        type: String,
        enum: ['National', 'International'],
        required: true
    },
    duration: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Funding', FundingSchema);
