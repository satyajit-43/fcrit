// const express = require('express');
// const router = express.Router();
// const { check } = require('express-validator');
// const { registerLeave, getbyhostel, getbystudent, resolve } = require('../controllers/leaveController');

// // @route   Register api/compalint/register
// // @desc    Register complaint
// // @access  Public
// router.post('/register', [
//     check('student', 'Student is required').not().isEmpty(),
//     check('hostel', 'Hostel is required').not().isEmpty(),
//     check('purpose', 'Purpose is required').not().isEmpty(),
//     check('leaving_date', 'Leaving Date is required').not().isEmpty(),
//     check('return_date', 'Return Date is required').not().isEmpty()
// ], registerLeave);

// // @route   GET api/complaint/hostel
// // @desc    Get all complaints by hostel id
// // @access  Public
// router.post('/hostel/', [
//     check('hostel', 'Hostel is required').not().isEmpty()
// ], getbyhostel);

// // @route   GET api/complaint/student
// // @desc    Get all complaints by student id
// // @access  Public
// router.post('/student', [
//     check('student', 'Student is required').not().isEmpty()
// ], getbystudent);

// // @route   GET api/complaint/resolve
// // @desc    Get complaint by complaint id
// // @access  Public
// router.post('/resolve', [
//     check('id', 'Complaint id is required').not().isEmpty()
// ], resolve);


// module.exports = router;


const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    requestLeave,
    countLeave,
    listLeave,
    updateLeave,
    myLeaveRequests,
} = require('../controllers/leaveController');

// @route   POST api/leave/request
// @desc    Request for leave
// @access  Public
router.post('/request', [
    check('student', 'Student ID is required').not().isEmpty(),
    check('from_date', 'From date is required').not().isEmpty(),
    check('to_date', 'To date is required').not().isEmpty(),
    check('reason', 'Reason is required').not().isEmpty()
], requestLeave);

// @route   POST api/leave/count
// @desc    Get leave count for the student for current month
// @access  Private
router.post('/count', [
    check('student', 'Student ID is required').not().isEmpty()
], countLeave);

// @route   POST api/leave/list
// @desc    Get all leave requests for a hostel
// @access  Public
router.post('/list', [
    check('hostel', 'Hostel is required').not().isEmpty()
], listLeave);

// @route   POST api/leave/update
// @desc    Update status of a leave request
// @access  Public
router.post('/update', [
    check('id', 'Leave request ID is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty()
], updateLeave);


// @route   POST /api/leave/myrequests
// @desc    Get all leave requests by student
// @access  Private
router.post('/myrequests', [
    check('student', 'Student ID is required').not().isEmpty()
  ], myLeaveRequests);

module.exports = router;