// routes/InquiryRoutes.js

const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const authenticate = require('../middleware/authMiddleware');

// @route   POST /api/inquiries
// @desc    Send an inquiry to a user
// @access  Public
router.post('/', async (req, res) => {
    const { recipientEmail, senderName, senderEmail, message } = req.body;

    if (!recipientEmail || !senderName || !senderEmail || !message) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const inquiry = new Inquiry({
        recipientEmail,
        senderName,
        senderEmail,
        message
    });

    try {
        await inquiry.save();
        res.status(201).json({ message: 'Inquiry sent successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries for the logged-in user
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ recipientEmail: req.user.email }).sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
