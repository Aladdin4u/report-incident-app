const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homecontroller = require("../controllers/home");
const reports = require("../controllers/reports");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureGuest, homecontroller.getIndex);
router.get("/about", homecontroller.getAbout);
router.get("/dashboard", ensureAuth, reports.getDashboard);
router.get("/login", ensureGuest, authController.getLogin);
router.post("/login", ensureGuest, authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", ensureGuest, authController.getSignup);
router.post("/signup", ensureGuest, authController.postSignup);
router.get("/forgotpassword", authController.getForgotPassword);
router.post("/forgotpassword", authController.postForgotPassword);
router.get("/resetpassword/:id", authController.getResetPassword);
router.post("/resetpassword/:id", authController.updateResetPassword);

module.exports = router;
