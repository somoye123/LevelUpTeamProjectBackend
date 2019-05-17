const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const CustomerController = require("../controllers/CustomerContoller");
const router = express.Router();

router.post("/SignUp", CustomerController.CreateCustomer);

router.post("/Login", CustomerController.LoginCustomer);

router.get("/", CustomerController.GetAllCustomers);

router.get("/Profile", AuthMiddleware, CustomerController.GetCustomerProfile);

router.put(
  "/Update",
  AuthMiddleware,
  CustomerController.UpdateCustomerProfile
);

module.exports = router;
