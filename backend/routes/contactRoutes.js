// routes/ContactRoutes.js

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/contact
// @desc    Get the contact info and inquiries of the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const contact = await Contact.findOne({ userEmail: req.user.email });
        if (!contact) {
            return res.status(404).json({ message: 'Contact information not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/contact
// @desc    Create or Update the contact info of the logged-in user
// @access  Private
router.post('/', auth, async (req, res) => {
    const { primaryEmail, linkedIn, github, huggingFace } = req.body;

    if (!primaryEmail) {
        return res.status(400).json({ message: 'Primary email is required' });
    }

    const contactFields = {
        userEmail: req.user.email,
        primaryEmail,
        linkedIn: linkedIn || '',
        github: github || '',
        huggingFace: huggingFace || ''
    };

    try {
        let contact = await Contact.findOne({ userEmail: req.user.email });

        if (contact) {
            // Update existing contact info
            contact = await Contact.findOneAndUpdate(
                { userEmail: req.user.email },
                { $set: contactFields },
                { new: true }
            );
            return res.json(contact);
        }

        // Create new contact info
        contact = new Contact(contactFields);
        await contact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/contact/inquiry/:recipientEmail
// @desc    Send an inquiry to another user's contact
// @access  Public
router.post('/inquiry/:recipientEmail', async (req, res) => {
    const { recipientEmail } = req.params;
    const { fromEmail, message } = req.body;

    if (!fromEmail || !message) {
        return res.status(400).json({ message: 'From email and message are required' });
    }

    try {
        const contact = await Contact.findOne({ userEmail: recipientEmail });
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
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/contact/inquiry/:inquiryId
// @desc    Delete an inquiry by ID
// @access  Private
router.delete('/inquiry/:inquiryId', auth, async (req, res) => {
    const { inquiryId } = req.params;

    try {
        const contact = await Contact.findOne({ userEmail: req.user.email });
        if (!contact) {
            return res.status(404).json({ message: 'Contact information not found' });
        }

        const inquiry = contact.inquiries.id(inquiryId);
        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        inquiry.remove();
        await contact.save();
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
