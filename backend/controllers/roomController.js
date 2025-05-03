const { validationResult } = require('express-validator');
const { Room } = require('../models');
const { Student } = require('../models');
const {RoomAllocation} = require('../models');
const mongoose = require('mongoose');

// 1. Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, hostel, capacity, floor, roomType } = req.body;
        console.log(roomNumber)

    // Validate room doesn't already exist
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ error: 'Room number already exists' });
    }

    const room = new Room({
      roomNumber,
      hostel,
      capacity: capacity || 2,
      floor,
      roomType: roomType || 'standard',
      status: 'available'
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Allocate student to room
exports.allocateStudent = async (req, res) => {
  try {
    const { student, room } = req.body; // Changed from studentId/roomId

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(student) || !mongoose.Types.ObjectId.isValid(room)) {
      return res.status(400).json({ success: false, error: 'Invalid IDs' });
    }

    // Find the room
    const roomToUpdate = await Room.findById(room);
    if (!roomToUpdate) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    // Check capacity
    if (roomToUpdate.currentOccupancy >= roomToUpdate.capacity) {
      return res.status(400).json({ success: false, error: 'Room at full capacity' });
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      student,
      { room_no: roomToUpdate.roomNumber },
      { new: true }
    );

    // Update room
    roomToUpdate.currentOccupancy += 1;
    if (roomToUpdate.currentOccupancy >= roomToUpdate.capacity) {
      roomToUpdate.status = 'occupied';
    }
    await roomToUpdate.save();

    res.json({
      success: true,
      room: roomToUpdate,
      student: updatedStudent
    });

  } catch (error) {
    console.error('Allocation error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// 3. Deallocate student from room
exports.deallocateStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId } = req.params;

    // Find active allocation
    const allocation = await RoomAllocation.findOne({
      student: studentId,
      isActive: true
    }).session(session);

    if (!allocation) {
      throw new Error('No active allocation found for this student');
    }

    // Get room and student
    const room = await Room.findById(allocation.room).session(session);
    const student = await Student.findById(studentId).session(session);

    // Update allocation
    allocation.isActive = false;
    allocation.deallocationDate = new Date();

    // Update room
    room.currentOccupancy -= 1;
    if (room.currentOccupancy < room.capacity) {
      room.status = 'available';
    }

    // Update student
    student.room_no = undefined;

    // Save changes
    await Promise.all([
      allocation.save({ session }),
      room.save({ session }),
      student.save({ session })
    ]);

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: 'Student deallocated successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// 4. Get room details with occupants
exports.getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const activeAllocations = await RoomAllocation.find({
      room: roomId,
      isActive: true
    }).populate('student', 'name roll_no email');

    res.status(200).json({
      room,
      occupants: activeAllocations.map(a => a.student),
      availableBeds: room.capacity - room.currentOccupancy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Get all rooms in a hostel with availability
exports.getHostelRooms = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const rooms = await Room.find({ hostel: hostelId });
    // console.log(rooms);
    const roomsWithAvailability = await Promise.all(
      rooms.map(async room => {
        const activeAllocations = await RoomAllocation.countDocuments({
          room: room._id,
          isActive: true
        });
        return {
          ...room.toObject(),
          availableBeds: room.capacity - activeAllocations
        };
      })
    );

    res.status(200).json(roomsWithAvailability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Update room details (e.g., maintenance status)
exports.updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const updates = req.body;

    // Prevent updating currentOccupancy directly
    if ('currentOccupancy' in updates) {
      return res.status(400).json({ error: 'Cannot manually update occupancy' });
    }

    const room = await Room.findByIdAndUpdate(roomId, updates, {
      new: true,
      runValidators: true
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getRoomByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student to get their room number
    const student = await Student.findById(studentId);
    if (!student || !student.room_no) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student has no room allocation' 
      });
    }

    // Find the room by room number and hostel
    const room = await Room.findOne({ 
      roomNumber: student.room_no,
      hostel: student.hostel
    });

    if (!room) {
      return res.status(404).json({ 
        success: false, 
        error: 'Room not found' 
      });
    }

    res.json({ 
      success: true, 
      room 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};