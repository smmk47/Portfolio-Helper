// models/Teaching.js
const mongoose = require('mongoose');

const teachingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    ref: 'User', // Referencing the User model if necessary
  },
  courseTitle: {
    type: String,
    required: true,
  },
  syllabus: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  lectureMaterial: {
    type: String,
    default: null,
  },
});

const Teaching = mongoose.model('Teaching', teachingSchema);
module.exports = Teaching;
