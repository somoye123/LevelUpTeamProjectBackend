const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../env");
const CustomerModel = require("../models/customerModel");
const sendMail = require("../email");

// Create Customer Account
const CreateCustomer = async function(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const customer = await CustomerModel.create(req.body);
    const token = jwt.sign({ id: customer._id }, env.jwt_secret, {
      expiresIn: "12h"
    });
    const result = customer.toJSON();
    delete result["password"];
    sendMail("Confirm", customer.email, token);
    res.status(200).json({ status: "success", result});
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        status: "error",
        message:
          "The email address you have entered is already associated with another account."
      });
    } else {
      res.status(500).json({
        status: "error",
        message:
          "An error occured while creating your account please contact the admin"
      });
    }
  }
};

//  Login in a Customer into their Account
LoginCustomer = async function(req, res) {
  try {
    const customer = await CustomerModel.findOne(
      { email: req.body.email },
      "+password"
    );
    if (!customer)
      return res
        .status(401)
        .json({ status: "not found", message: "Invalid login details" });

    //compare customer's password to login the customer
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      customer.password
    );
    if (!isValidPassword)
      return res
        .status(401)
        .json({ status: "error", message: "Invalid Login details" });

    // check if customer email as been verified
    if (!customer.isVerified)
      return res.status(412).json({
        status: "error",
        message: "Click on the verification link sent to your mail"
      });
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

// Get the list of all Customers
const GetAllCustomers = async function(req, res) {
  try {
    const customers = await CustomerModel.find({});
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

// Get a single customer profile information
const GetCustomerProfile = async function(req, res) {
  try {
    const profile = await CustomerModel.findById(req.user);
    if (!profile)
      return res.status(400).json({
        status: "error",
        message: " An error occured trying to get your profile details"
      });
    res.json({ status: "Success", data: profile });
  } catch (err) {
    console.log(err);

    //show error to user
    res.status(500).json({ status: "error", message: err.message });
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
    res.json({ status: "Success", data: customer });
  } catch (err) {
    console.log(err);

    //show error to user
    res.status(401).json({
      status: "error",
      message: "An error occured while updating your profile"
    });
  }
};

// Email Verification
const EmailVerification = async function(req, res) {
  try {
    const token = req.body.token;
    const tokenData = jwt.verify(token, env.jwt_secret);

    const customer = await CustomerModel.findById(tokenData.id);
    if (customer.isVerified)
      return res.status(422).json({
        status: "error",
        message: "account has already been verified"
      });

    const updateCustomer = await CustomerModel.findByIdAndUpdate(
      tokenData.id,
      {
        isVerified: true
      },
      {
        new: true
      }
    );
    if (!updateCustomer)
      return res.status(403).json({
        status: "error",
        message: "user not found"
      });
    res.status(200).json({
      status: "success",
      data: updateCustomer
    });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "you are not authorizaed"
    });
  }
};

const ResendEmail = async function(req, res) {
  try {
    const customer = await CustomerModel.findOne({ email: req.body.email });
    if (!customer)
      return res
        .status(404)
        .json({ status: "error", message: "Customer not found" });
    if (customer.isVerified)
      return res
        .status(422)
        .json({ status: "error", message: "you are already verified" });
    const token = jwt.sign(
      {
        id: customer._id
      },
      env.jwt_secret,
      {
        expiresIn: "2h"
      }
    );
    sendMail("Confirm", customer.email, token);
    res.status(200).json({
      status: "success",
      message: "verification message as been re-sented to your mail"
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "server error" });
  }
};

const ForgetEmail = async function(req, res) {
  try {
    const customer = await CustomerModel.findOne({ email: req.body.email });
    if (customer) {
      const token = jwt.sign(
        {
          id: customer._id
        },
        env.jwt_secret,
        {
          expiresIn: 30
        }
      );
      sendMail("Reset-password", "somoye.ayotunde@gmail.com", token);
    }
    res.status(200).json({
      status: "success",
      message: "reset password link has been sent to your email"
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "server error" });
  }
};

const ResetPassword = async function(req, res) {
  try {
    if (!(req.body && req.body.token && req.body.password)) {
      return res.status(403).json({
        status: "invalid params",
        message: "email and token is required"
      });
    }
    const verifyToken = jwt.verify(req.body.token, env.jwt_secret);

    const customer = await CustomerModel.findById(verifyToken.id);
    if (!customer)
      res.status(404).json({ status: "error", message: "Customer not found" });

    const password = await bcrypt.hash(req.body.password, 10);
    const updatePassword = await CustomerModel.findByIdAndUpdate(customer._id, {
      password: password
    });

    res.status(200).json({ status: "success", message: updatePassword });
  } catch (error) {
    res.status(401).json({ status: "error", message: error });
  }
};

module.exports = {
  CreateCustomer,
  LoginCustomer,
  GetAllCustomers,
  GetCustomerProfile,
  UpdateCustomerProfile,
  EmailVerification,
  ResendEmail,
  ForgetEmail,
  ResetPassword
};
