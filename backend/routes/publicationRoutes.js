// routes/publicationRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Publication = require('../models/publication');

// Set up file storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Get all publications for a specific user
router.get('/:email', async (req, res) => {
  try {
    const publications = await Publication.find({ email: req.params.email });
    res.json(publications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new publication
router.post('/', upload.single('pdf'), async (req, res) => {
  const { title, link, email } = req.body;
  const pdf = req.file ? req.file.path : null;

  const newPublication = new Publication({ title, link, pdf, email });
  try {
    await newPublication.save();
    res.status(201).json(newPublication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a publication
router.delete('/:id', async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.status(200).json({ message: 'Publication deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
