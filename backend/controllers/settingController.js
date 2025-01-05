// backend/controllers/settingController.js

const Setting = require('../models/Setting');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// @desc    Get settings of the logged-in user
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
    try {
        const setting = await Setting.findOne({ userEmail: req.user.email });
        if (!setting) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.json(setting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update settings of the logged-in user
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
    const { visibility } = req.body;

    try {
        let setting = await Setting.findOne({ userEmail: req.user.email });

        if (setting) {
            setting.visibility = { ...setting.visibility, ...visibility };
            await setting.save();
            return res.json(setting);
        }

        // If settings do not exist, create new
        setting = new Setting({
            userEmail: req.user.email,
            visibility
        });
        await setting.save();
        res.json(setting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update user profile (name, profile picture, password)
// @route   PUT /api/settings/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { name, password } = req.body;
    const profilePic = req.file ? req.file.path : null;

    try {
        let user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (profilePic) user.profilePic = profilePic;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
                dob: user.dob,
                phone: user.phone,
                profilePic: user.profilePic
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
