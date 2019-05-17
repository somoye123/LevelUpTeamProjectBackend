const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const LoanRequestController = require("../controllers/LoanRequestController");
const router = express.Router();

router.post("/", AuthMiddleware, LoanRequestController.CreateLoanRequest);

router.get("/", AuthMiddleware, LoanRequestController.GetLoanRequest);

module.exports = router;
