const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomAllocationSchema = new Schema({
  student: {
      type: Schema.Types.ObjectId,
      ref: 'student',
      required: true
  },
  room: {
      type: Schema.Types.ObjectId,
      ref: 'room',
      required: true
  },
  allocationDate: {
      type: Date,
      default: Date.now
  },
  deallocationDate: {
      type: Date
  },
  isActive: {
      type: Boolean,
      default: true
  },
});

module.exports = RoomAllocation = mongoose.model('roomallocation', RoomAllocationSchema);
