// routes/ProfileRoutes.js

const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Multer configuration

// @route   GET /api/profile
// @desc    Get the profile of the logged-in user
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userEmail: req.user.email });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/profile
// @desc    Create or Update the profile of the logged-in user
// @access  Private
router.post('/', authenticate, upload.single('profilePicture'), async (req, res) => {
    const { name, currentPosition, university, skills, projects, workExperience } = req.body;

    if (!name || !currentPosition || !university) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const profileFields = {
        userEmail: req.user.email,
        name,
        currentPosition,
        university,
        skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
        projects: projects ? JSON.parse(projects) : [],
        workExperience: workExperience ? JSON.parse(workExperience) : [],
    };

    if (req.file) {
        profileFields.profilePicture = `/uploads/${req.file.filename}`;
    }

    try {
        let profile = await Profile.findOne({ userEmail: req.user.email });

        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                { userEmail: req.user.email },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create new profile
        profile = new Profile(profileFields);
        await profile.save();
        res.status(201).json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/profile
// @desc    Delete the profile of the logged-in user
// @access  Private
router.delete('/', authenticate, async (req, res) => {
    try {
        const profile = await Profile.findOneAndDelete({ userEmail: req.user.email });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json({ message: 'Profile deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
