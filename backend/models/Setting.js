// backend/models/Setting.js

const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    visibility: {
        profile: { type: Boolean, default: true },
        blog: { type: Boolean, default: true },
        contact: { type: Boolean, default: true },
        gallery: { type: Boolean, default: true },
        publications: { type: Boolean, default: true },
        teaching: { type: Boolean, default: true },
        funding: { type: Boolean, default: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
