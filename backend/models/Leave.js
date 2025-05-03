// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const LeaveSchema = new Schema({
//     student:{
//         type:Schema.Types.ObjectId,
//         ref:'student'
//     },
//     hostel:{
//         type:Schema.Types.ObjectId,
//         ref:'hostel'
//     },
//     purpose:{
//         type:String,
//         required:true
//     },
//     status:{
//         type:String,
//         default:'pending'
//     },
//     leaving_date:{
//         type:Date,
//         required:true
//     },
//     return_date:{
//         type:Date,
//         required:true
//     },
// })

// module.exports = Leave = mongoose.model('leave',LeaveSchema);


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    hostel:{
        type:Schema.Types.ObjectId,
        ref:'hostel'
    },
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'approved', 'rejected'],
        default: 'new'
    },
    request_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Leave = mongoose.model('leave', LeaveSchema);