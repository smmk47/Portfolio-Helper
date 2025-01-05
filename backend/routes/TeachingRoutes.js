// routes/TeachingRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Teaching = require('../models/Teaching');
const router = express.Router();

// Setup file storage for uploaded lecture materials
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Fetch teaching portfolio by email
router.get('/:email', async (req, res) => {
  try {
    const portfolio = await Teaching.find({ email: req.params.email });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teaching data.' });
  }
});

// Add or update teaching portfolio data
router.post('/:email', upload.single('lectureMaterial'), async (req, res) => {
  try {
    const { courseTitle, syllabus, duration, feedback } = req.body;
    const email = req.params.email;
    const lectureMaterial = req.file ? req.file.filename : null;

    const newCourse = new Teaching({
      email,
      courseTitle,
      syllabus,
      duration,
      feedback,
      lectureMaterial,
    });

    const savedCourse = await newCourse.save();
    res.json(savedCourse);
  } catch (error) {
    res.status(400).json({ error: 'Error saving teaching data.' });
  }
});

module.exports = router;
