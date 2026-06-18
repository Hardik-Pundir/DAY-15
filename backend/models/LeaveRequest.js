const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate:      { type: Date, required: true },
  endDate:        { type: Date, required: true },
  reason:         { type: String },
  status:         { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  managerComment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveSchema);
