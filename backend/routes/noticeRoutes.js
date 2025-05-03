const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getNoticesForStudent,
  createNotice,
  deleteNotice,
  getAllNotices
} = require('../controllers/noticeController');

// @route   POST api/notice/student
// @desc    Get all notices for a student
// @access  Public
router.post('/student', [
  // Optional: Add student-based validation if filtering per student/hostel
], getNoticesForStudent);

// @route   POST api/notice/create
// @desc    Create a new notice
// @access  Admin
router.post('/create', [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
], createNotice);

// @route   GET api/notice/getall
// @desc    Get all notices (admin use)
// @access  Admin
router.get('/getall', getAllNotices);

// @route   DELETE api/notice/:id
// @desc    Delete a notice
// @access  Admin
router.delete('/:id', deleteNotice);

module.exports = router;
