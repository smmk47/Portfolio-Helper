// routes/galleryRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Gallery = require('../models/Gallery');
const router = express.Router();

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// POST route for uploading an image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { category, email } = req.body;
    const newImage = new Gallery({
      url: `/uploads/${req.file.filename}`,
      category,
      email,
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: 'Failed to upload image.' });
  }
});

// GET route for fetching images by user email
router.get('/:email', async (req, res) => {
  try {
    const images = await Gallery.find({ email: req.params.email });
    res.json(images);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch images.' });
  }
});

module.exports = router;
