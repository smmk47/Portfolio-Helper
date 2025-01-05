// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, getUser } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Set up multer for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1616161616161.png
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter,
});

router.post('/signup', upload.single('profilePic'), signup);
router.post('/login', login);
router.get('/user', auth, getUser);

module.exports = router;
