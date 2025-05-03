// models/Room.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    hostel: {
        type: Schema.Types.ObjectId,
        ref: 'hostel',
        required: true
    },
    capacity: {
        type: Number,
        default: 2  // Default beds per room
    },
    currentOccupancy: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'under_maintenance'],
        default: 'available'
    },
    floor: {
        type: Number,
        required: true
    },
    roomType: {
        type: String,
        enum: ['standard', 'deluxe', 'ac'],
        default: 'standard'
    }
});

module.exports = Room = mongoose.model('room', RoomSchema);
