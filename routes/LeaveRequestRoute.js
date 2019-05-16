const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const LeaveRequestController = require("../controllers/LeaveRequestController");
const router = express.Router();

router.post("/", LeaveRequestController.CreateLeaveRequest);

router.get("/", AuthMiddleware, LeaveRequestController.GetLeaveRequest);

module.exports = router;
