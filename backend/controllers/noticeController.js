const { validationResult } = require('express-validator');
const { Notice } = require('../models');

// @route   POST api/notice/student
// @desc    Get notices for a student
// @access  Public (or Protected if you implement auth)
exports.getNoticesForStudent = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }

    try {
        // You can filter notices by hostel/student later if needed
        const notices = await Notice.find().sort({ date: -1 }); // Latest first
        success = true;
        res.status(200).json({ success, notices });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   POST api/notice/create
// @desc    Create a new notice (admin use)
// @access  Admin
exports.createNotice = async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }

    const { title, description } = req.body;

    try {
        const notice = new Notice({
            title,
            description,
            date: new Date()  // Can also be passed manually
        });

        await notice.save();
        success = true;
        res.status(201).json({ success, notice });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Optional: Delete notice
// @route   DELETE api/notice/:id
// @desc    Delete a notice by ID
// @access  Admin
exports.deleteNotice = async (req, res) => {
    let success = false;

    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) {
            return res.status(404).json({ success, message: 'Notice not found' });
        }

        await notice.deleteOne();
        success = true;
        res.status(200).json({ success, message: 'Notice deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   GET api/notice/getall
// @desc    Get all notices (for admin)
// @access  Admin
exports.getAllNotices = async (req, res) => {
    let success = false;

    try {
        const notices = await Notice.find().sort({ date: -1 }); // latest first
        success = true;
        res.status(200).json({ success, notices });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success, message: 'Server error' });
    }
};
