// backend/routes/SettingRoutes.js

const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, updateProfile } = require('../controllers/settingController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Set up multer for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, req.user.email + '_' + Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
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

router.get('/', auth, getSettings);
router.put('/', auth, updateSettings);
router.put('/profile', auth, upload.single('profilePic'), updateProfile);

module.exports = router;
