const express = require("express");
const AuthMiddleware = require("../middlewares/auth");
const CustomerController = require("../controllers/CustomerContoller");
const router = express.Router();

router.post("/SignUp", CustomerController.CreateCustomer);

router.post("/Login", CustomerController.LoginCustomer);

router.post("/Confirm", CustomerController.EmailVerification);

router.post("/Resend", CustomerController.ResendEmail);

router.post("/Forget-password", CustomerController.ForgetEmail);

router.post("/Reset-password", CustomerController.ResetPassword);

router.get("/", CustomerController.GetAllCustomers);

router.get("/Profile", AuthMiddleware, CustomerController.GetCustomerProfile);

router.put("/Update", AuthMiddleware, CustomerController.UpdateCustomerProfile);

module.exports = router;
