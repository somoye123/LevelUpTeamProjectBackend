const mongoose = require("mongoose");

const LeaveRequestSchema = new mongoose.Schema({
  leaveType: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  stopDate: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  leaveReason: {
    type: String,
    required: true
  },
  employee: {
    // The leave request employee's ID
    type: String,
    ref: "Employee",
    required: true
  }
});

const LeaveRequestModel = mongoose.model("LeaveRequest", LeaveRequestSchema);

module.exports = LeaveRequestModel;
