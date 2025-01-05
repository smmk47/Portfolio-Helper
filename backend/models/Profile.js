// models/Profile.js

const mongoose = require('mongoose');

const WorkExperienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    link: { type: String }
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    name: { type: String, required: true },
    currentPosition: { type: String, required: true },
    university: { type: String, required: true },
    skills: [{ type: String }],
    projects: [ProjectSchema],
    workExperience: [WorkExperienceSchema],
    profilePicture: { type: String }, // URL or path to the profile picture
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
