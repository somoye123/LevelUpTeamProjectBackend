const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const CustomerController = require("../controllers/CustomerController");
const router = express.Router();


router.post("/SignUp", CustomerController.CreateCustomer);

router.post("/Login", CustomerController.LoginCustomer);

router.get("/", CustomerController.GetAllCustomers);

router.get("/profile", AuthMiddleware, CustomerController.GetCustomerProfile);

module.exports = router;
