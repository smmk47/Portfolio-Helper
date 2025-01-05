// backend/routes/ViewProfileRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Setting = require('../models/Setting');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const Publication = require('../models/publication');
const Teaching = require('../models/Teaching');
const Funding = require('../models/Funding');

// @route   GET /api/viewprofile
// @desc    Get list of all users with basic info
// @access  Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('name email profilePic');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/viewprofile/:email
// @desc    Get specific user's profile based on their settings
// @access  Public
router.get('/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Find user
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find settings
        let settings = await Setting.findOne({ userEmail: email });
        if (!settings) {
            // If settings not found, assume all sections are public
            settings = {
                visibility: {
                    profile: true,
                    blog: true,
                    contact: true,
                    gallery: true,
                    publications: true,
                    teaching: true,
                    funding: true
                }
            };
        }

        // Build the profile object based on visibility settings
        const profile = {};

        if (settings.visibility.profile) {
            profile.profile = {
                name: user.name,
                email: user.email,
                dob: user.dob,
                phone: user.phone,
                profilePic: user.profilePic
            };
        }

        if (settings.visibility.blog) {
            // Fetch blogs related to the user
            const blogs = await Blog.find({ email });
            profile.blog = blogs;
        }

        if (settings.visibility.contact) {
            // Fetch contact info related to the user
            const contact = await Contact.findOne({ userEmail: email }).select('-inquiries');
            profile.contact = contact;
        }

        if (settings.visibility.gallery) {
            // Fetch gallery images related to the user
            const gallery = await Gallery.find({ email });
            profile.gallery = gallery;
        }

        if (settings.visibility.publications) {
            // Fetch publications related to the user
            const publications = await Publication.find({ email });
            profile.publications = publications;
        }

        if (settings.visibility.teaching) {
            // Fetch teaching experiences related to the user
            const teaching = await Teaching.find({ email });
            profile.teaching = teaching;
        }

        if (settings.visibility.funding) {
            // Fetch funding information related to the user
            const funding = await Funding.find({ userEmail: email });
            profile.funding = funding;
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/viewprofile/:email/inquiry
// @desc    Send an inquiry to a user
// @access  Public
router.post('/:email/inquiry', async (req, res) => {
    const { email } = req.params;
    const { fromEmail, message } = req.body;

    if (!fromEmail || !message) {
        return res.status(400).json({ message: 'From email and message are required' });
    }

    try {
        const contact = await Contact.findOne({ userEmail: email });
        if (!contact) {
            return res.status(404).json({ message: 'Recipient contact information not found' });
        }

        const newInquiry = {
            fromEmail,
            message
        };

        contact.inquiries.push(newInquiry);
        await contact.save();

        res.status(201).json({ message: 'Inquiry sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
