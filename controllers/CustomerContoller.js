const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../env");
const CustomerModel = require("../models/customerModel");

/**
 *Create Customer Account
 */

const CreateCustomer = async function(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const customer = await CustomerModel.create(req.body);
    const token = jwt.sign({ id: customer._id }, env.jwt_secret, {
      expiresIn: "1h"
    });
    const result = customer.toJSON();
    delete result["password"];
    res.status(200).json({
      status: "success",
      data: { result, token }
    });
  } catch (err) {
    if (err.code === 11000) {
      res
        .status(400)
        .json({ status: "error", message: "this email already exist" });
    } else {
      res.status(500).json({
        status: "error",
        message:
          "An error occured while creating your account please contact the admin"
      });
    }
  }
};

/**
 *Login in a Customer into their Account
 */

LoginCustomer = async function(req, res) {
  try {
    const customer = await CustomerModel.findOne(
      { email: req.body.email },
      "+password"
    );
    if (!customer)
      return res
        .status(401)
        .json({ status: "error", message: "Invalid login details" });

    //compare user's password to log the user in
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      customer.password
    );
    if (!isValidPassword)
      return res
        .status(401)
        .json({ status: "error", message: "Invalid Login details" });

    const token = jwt.sign({ id: customer.id }, env.jwt_secret);
    res.status(200).json({ status: "success", data: { token } });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occured while trying to log you in"
    });
    console.log(error);
  }
};

/**
 *Get the list of all Employees
 */

const GetAllCustomers = async function(req, res) {
  try {
    const search = req.query.email ? { email: req.query.email } : {};

    const customers = await CustomerModel.find(search);
    res.json({
      status: "Success",
      customers
    });
  } catch (err) {
    console.log(err);

    res.status(200).json({
      status: "error",
      message: "An error occurred while trying to get an account"
    });
  }
};

/**
 *Get a single customer profile information
 */

const GetCustomerProfile = async function(req, res) {
  try {
    const customer = await CustomerModel.findById(req.user);
    res.json({ status: "Success", data: customer });
  } catch (err) {
    console.log(err);

    //show error to user
    res.status(401).json({ status: "error", message: err.message });
  }
};

/* Update a single customer profile information */

const UpdateCustomerProfile = async function(req, res) {
  try {
    const customer = await CustomerModel.findOneAndUpdate(
      req.user,
      {
        password: req.body.password,
        occupation: req.body.occupation,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        img: req.body.img
      },
      () => {
        console.log("Profile details Updated Successfully");
      }
    );
    res.json({ status: "Success", data: customer,});
  } catch (err) {
    console.log(err);

    //show error to user
    res.status(401).json({
      status: "error",
      message: "An error occured while updating your profile"
    });
  }
};

module.exports = {
  CreateCustomer,
  LoginCustomer,
  GetAllCustomers,
  GetCustomerProfile,
  UpdateCustomerProfile
};
