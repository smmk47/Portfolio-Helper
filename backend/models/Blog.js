// models/Blog.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // Stored as JSON string
  categories: { type: String, required: false },
  tags: { type: String, required: false },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  email: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
