// routes/FundingRoutes.js

const express = require('express');
const router = express.Router();
const Funding = require('../models/Funding');

// Middleware to authenticate user and get email
// Assume you have an authentication middleware
const authenticate = require('../middleware/authMiddleware');

// @route   GET /api/fundings
// @desc    Get all fundings for the logged-in user
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const fundings = await Funding.find({ userEmail: req.user.email });
        res.json(fundings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/fundings
// @desc    Add a new funding
// @access  Private
router.post('/', authenticate, async (req, res) => {
    const { agency, amount, projectTimeline, type, duration } = req.body;

    if (!agency || !amount || !projectTimeline || !type || !duration) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newFunding = new Funding({
        userEmail: req.user.email,
        agency,
        amount,
        projectTimeline,
        type,
        duration
    });

    try {
        const funding = await newFunding.save();
        res.status(201).json(funding);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   PUT /api/fundings/:id
// @desc    Update a funding
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
    try {
        const funding = await Funding.findById(req.params.id);

        if (!funding) {
            return res.status(404).json({ message: 'Funding not found' });
        }

        if (funding.userEmail !== req.user.email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { agency, amount, projectTimeline, type, duration } = req.body;

        funding.agency = agency || funding.agency;
        funding.amount = amount || funding.amount;
        funding.projectTimeline = projectTimeline || funding.projectTimeline;
        funding.type = type || funding.type;
        funding.duration = duration || funding.duration;

        const updatedFunding = await funding.save();
        res.json(updatedFunding);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/fundings/:id
// @desc    Delete a funding
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const funding = await Funding.findById(req.params.id);

        if (!funding) {
            return res.status(404).json({ message: 'Funding not found' });
        }

        if (funding.userEmail !== req.user.email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await funding.remove();
        res.json({ message: 'Funding removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
