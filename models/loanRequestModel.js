const mongoose = require("mongoose");

/**
 * mongoose loanRequest schema
 */

const LoanRequestSchema = new mongoose.Schema({
    accountNumber:{
        type: Number,
        required: true
    },
    bankName:{
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    repaymentPlan: {
        type: String,
        required: true
    },
    customer: {
        // The loan request customer's ID
        type: String,
        ref: "Customer",
        required: true
    }
});

//model which provides us with an interface to iteract with our data
const LoanRequestModel = mongoose.model("LoanRequest", LoanRequestSchema);

module.exports = LoanRequestModel;
