const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createRoom,
  allocateStudent,
  deallocateStudent,
  getRoomDetails,
  getHostelRooms,
  updateRoom,
  getRoomByStudent,
//   getRoomOccupants,
//   checkRoomAvailability
} = require('../controllers/roomController');

// @route   POST api/rooms
// @desc    Create new room
// @access  Public
router.post('/', [
  check('roomNumber', 'Room number is required').not().isEmpty(),
  check('hostel', 'Hostel ID is required').not().isEmpty().isMongoId(),
  check('floor', 'Floor number is required').not().isEmpty(),
  check('capacity', 'Capacity must be a number').optional().isInt({ min: 1 })
], createRoom);

// @route   POST api/rooms/allocate
// @desc    Allocate student to room
// @access  Public
router.post('/allocate', [
  check('studentId', 'Student ID is required').not().isEmpty().isMongoId(),
  check('roomId', 'Room ID is required').not().isEmpty().isMongoId()
], allocateStudent);

// @route   DELETE api/rooms/deallocate/:studentId
// @desc    Deallocate student from room
// @access  Public
router.delete('/deallocate/:studentId', [
  check('studentId', 'Invalid student ID').isMongoId()
], deallocateStudent);

// @route   GET api/rooms/:id
// @desc    Get room details
// @access  Public
router.get('/:id', [
  check('id', 'Invalid room ID').isMongoId()
], getRoomDetails);

// @route   GET api/rooms/hostel/:hostelId
// @desc    Get all rooms in hostel
// @access  Public
router.get('/hostel/:hostelId', [
  check('hostelId', 'Invalid hostel ID').isMongoId()
], getHostelRooms);

// @route   PATCH api/rooms/:id
// @desc    Update room details
// @access  Public
router.patch('/:id', [
  check('id', 'Invalid room ID').isMongoId(),
  check('status', 'Invalid status').optional().isIn(['available', 'occupied', 'under_maintenance']),
  check('roomType', 'Invalid room type').optional().isIn(['standard', 'deluxe', 'ac'])
], updateRoom);


/*
// @route   GET api/rooms/:id/occupants
// @desc    Get all occupants in room
// @access  Public
router.get('/:id/occupants', [
  check('id', 'Invalid room ID').isMongoId()
], getRoomOccupants);

// @route   GET api/rooms/hostel/:hostelId/availability
// @desc    Check room availability in hostel
// @access  Public
router.get('/hostel/:hostelId/availability', [
  check('hostelId', 'Invalid hostel ID').isMongoId()
], checkRoomAvailability);

*/

router.get('/student/:studentId', [
  check('studentId', 'Invalid student ID').isMongoId()
], getRoomByStudent);

module.exports = router;