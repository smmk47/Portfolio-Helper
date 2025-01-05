// models/Gallery.js
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true },
});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
