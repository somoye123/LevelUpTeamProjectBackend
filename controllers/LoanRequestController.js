const LoanRequestModel = require("../models/loanRequestModel");

/**
 * Create a new loan request
 */

const CreateLoanRequest = async function(req, res) {
  try {
    const loanRequest = await LoanRequestModel.create({
      accountNumber: req.body.accountNumber,
      bankName: req.body.bankName,
      accountName: req.body.accountName,
      companyName: req.body.companyName,
      loanAmount: req.body.loanAmount,
      repaymentPlan: req.body.repaymentPlan,
      customer: req.user
    });
    res.json({ status: "success", data: loanRequest });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "🤦🏾 an error occured while processing your loan request"
    });
  }
};

/**
 * Get all customer loanRequests
 */

const GetLoanRequest = async function(req, res) {
  try {
    const loanRequests = await LoanRequestModel.find({
      customer: req.user
    }).populate("customer");
    res.json({ status: "success", data: loanRequests });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Could not find any loan requests!" });
  }
};

module.exports = {
  CreateLoanRequest,
  GetLoanRequest
};
