// const { validationResult } = require('express-validator');
// const { Leave } = require('../models');

// // @route   Register api/compalint
// // @desc    Register complaint
// // @access  Public
// exports.registerLeave = async (req, res) => {
//     let success = false;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array(), success });
//     }
//     const { student, hostel, purpose, leaving_date,return_date } = req.body;
//     try {
//         const newComplaint = new Leave({
//             student,
//             hostel,
//             purpose,
//             leaving_date,
//             return_date
//         });
//         await newComplaint.save();
//         success = true;
//         res.json({ success, msg: 'Leave registered successfully' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// }

// // @route   GET api/complaint
// // @desc    Get all complaints by hostel id
// // @access  Public
// exports.getbyhostel = async (req, res) => {
//     let success = false;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array(), success });
//     }
//     const { hostel } = req.body;
//     try {
//         const complaints = await Complaint.find({ hostel }).populate('student', ['name', 'room_no']);
//         success = true;
//         res.json({ success, complaints });
//     }
//     catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// }

// // @route   GET api/complaint
// // @desc    Get all complaints by student id
// // @access  Public
// exports.getbystudent = async (req, res) => {
//     let success = false;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array(), success });
//     }
//     const { student } = req.body;
//     try {
//         const leaves = await Leave.find({ student });
//         success = true;
//         res.json({ success, leaves });
//     }
//     catch (err) {
//         console.error(err.errors);
//         res.status(500).send('Server error');
//     }
// }

// // @route   GET api/complaint
// // @desc    Get complaint by complaint id
// // @access  Public
// exports.resolve = async (req, res) => {
//     let success = false;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array(), success });
//     }
//     const { id } = req.body;
//     try {
//         const leave = await Leave.findById(id);
//         leave.status = "solved";
//         await leave.save();
//         success = true;
//         res.json({ success });
//     }
//     catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// }



const { validationResult } = require('express-validator');
const { Leave, Student } = require('../models/');

// @route   POST api/leave/request
// @desc    Request for leave
// @access  Public
exports.requestLeave = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array(), success });
  }

  const { student, from_date, to_date, reason, hostel } = req.body;
  const today = new Date();

  // Validate required fields
  if (!student || !from_date || !to_date || !reason || !hostel) {
      return res.status(400).json({ success, message: "Missing required fields" });
  }

  if (new Date(from_date) > new Date(to_date)) {
      return res.status(400).json({ success, message: "Start date cannot be after end date" });
  } else if (new Date(from_date) < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({ success, message: "Cannot request leave for past dates" });
  }

  try {
      const leave = new Leave({
          student,
          hostel,         // ✅ Added hostel here
          from_date,
          to_date,
          reason,
          status: "new" // 👈 ADD THIS LINE
      });

      await leave.save();
      success = true;
      return res.status(200).json({ success, message: "Leave request submitted successfully" });

  } catch (err) {
      console.error(err.message);
      return res.status(500).json({ success, message: "Server Error" });
  }
};

// @route   GET api/leave/count
// @desc    Get leave request count for current month
// @access  Private
exports.countLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }

    const { student } = req.body;
    try {
        const date = new Date();
        const list = await Leave.find({
            student,
            from_date: {
                $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            }
        });

        const approvedLeaves = await Leave.find({
            student,
            status: "approved",
            from_date: {
                $gte: new Date(date.getFullYear(), date.getMonth(), 1),
                $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            }
        });

        let totalDays = 0;
        approvedLeaves.forEach(l => {
            totalDays += (new Date(l.to_date) - new Date(l.from_date)) / (1000 * 60 * 60 * 24) + 1;
        });

        success = true;
        return res.status(200).json({ success, list, approved: totalDays });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, message: "Server Error" });
    }
};

// @route   GET api/leave/list
// @desc    Get all pending leave requests in a hostel
// @access  Public
exports.listLeave = async (req, res) => {
    try {
      const { hostel } = req.body;
  
      if (!hostel) {
        return res.status(400).json({ success: false, message: "Hostel ID missing" });
      }
  
      const allRequests = await Leave.find({ hostel })
        .populate("student", "name room_no")
        .sort({ createdAt: -1 });
  
      const approved = allRequests.filter(req => req.status === 'approved').length;
      const rejected = allRequests.filter(req => req.status === 'rejected').length;
      const newReqs = allRequests.filter(req => req.status === 'new');
  
      res.status(200).json({
        success: true,
        list: newReqs,
        approved,
        rejected
      });
  
    } catch (error) {
      console.error("Error in listLeaveRequestsAdmin:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

// @route   PUT api/leave/update
// @desc    Update leave request status
// @access  Public
exports.updateLeave = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), success });
    }

    const { id, status } = req.body;

    try {
        const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
        success = true;
        return res.status(200).json({ success, leave });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success, errors: [{ msg: "Server Error" }] });
    }
};

// My request api
exports.myLeaveRequests = async (req, res) => {
    try {
      const { student } = req.body;
  
      if (!student) {
        return res.status(400).json({ success: false, message: "Student ID missing" });
      }
  
      const list = await Leave.find({ student })
        .populate("student", "name room_no")
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, list });
    } catch (error) {
      console.error("Error in myLeaveRequests:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };