// models/publication.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PublicationSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  pdf: { type: String, required: false },
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Publication', PublicationSchema);
