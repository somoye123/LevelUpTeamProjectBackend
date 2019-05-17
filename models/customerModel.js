const mongoose = require("mongoose");

/**
 * mongoose customer schema
 */

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  dob: {
    type: Date
  },
  img: {
    data: Buffer,
    contentType: String
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  }
});

//model which provides us with an interface to iteract with our data
const CustomerModel = mongoose.model("Customer", customerSchema);

module.exports = CustomerModel;
