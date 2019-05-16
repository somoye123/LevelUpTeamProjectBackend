const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../env");
const CustomerModel = require("../models/employeeModel");

/**
 *Create Customer Account
 */

const CreateCustomer = async function (req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const customer = await CustomerModel.create(req.body);
    const token = jwt.sign({ id: customer._id }, env.jwt_secret, { expiresIn: "1h" });
    const result = employee.toJSON();
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
        message: "An error occured while creating your account please contact admin"
      });
    }
  }
};

/**
 *Login in a Customer into their Account
 */
const LoginCustomer = async function (req, res) {
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
            Customer.password
        );
        if (!isValidPassword)
            return res
                .status(401)
                .json({ status: "error", message: "Invalid Login details" });

        const token = jwt.sign({ id: customer.id }, env.jwt_secret);
        res.status(200).json({ status: "success", data: { token } });
    } catch (error) {
        res.status(500).json({ status: "error", message: "error occured" });
        console.log(error);
    }
}

/**
 *Get the list of all Employees
 */
const GetAllCustomers = async function (req, res) {
    try {
        const search = req.query.gender ? { gender: req.query.gender } : {};

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
}

/**
 *Get a single employee profile information
 */
const GetCustomerProfile = async function (req, res) {
    try {
        const customer = await CustomerModel.findById(req.user);

        res.json({ status: "Success", data: customer });
    } catch (err) {
        console.log(err);

        //show error to user
        res.status(401).json({ status: "error", message: err.message });
    }
}

module.exports = {
  CreateCustomer,
  LoginCustomer,
  GetAllCustomers,
  GetCustomerProfile
};
