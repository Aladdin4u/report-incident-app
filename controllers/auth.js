const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { randomToken, promisify } = require("../utils/crypto");

exports.getLogin = (req, res) => {
  const users = req.user;
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("login", {
    title: "Login",
    users,
  });
};

exports.postLogin = (req, res, next) => {
  // const users = req.user;
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address." });
  }
  if (validator.isEmpty(req.body.password)) {
    validationErrors.push({ msg: "Password cannot be blank." });
  }

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/dashboard");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log("User has logged out.");
  });
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    return res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  const users = req.user;
  if (req.user) {
    return res.redirect("/dashboard");
  }
  res.render("signup", {
    title: "Create Account",
    users,
  });
};

exports.postSignup = (req, res, next) => {
  const users = req.user;
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", { msg: validationErrors });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/dashboard");
        });
      });
    }
  );
};

exports.getForgotPassword = (req, res) => {
  const users = req.user;
  res.render("forgotpassword", {
    title: "Forgot password",
    users,
  });
};

exports.postForgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    req.flash("error", { msg: "No account with that email address exists." });
    return res.redirect("/forgotpassword");
  }

  const token = randomToken;
  newToken = {
    resetPasswordToken: token,
    resetPasswordExpires: Date.now() + 3600000,
  };

  await User.updateOne(
    { _id: user._id },
    { $set: { token: newToken } },
    {
      new: true,
    }
  );

  const message = `
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      http://${req.headers.host}/resetpassword/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

  sendEmail(user.email, "Password Reset", message);

  req.flash("info", {
    msg: `An e-mail has been sent to ${user.email} with further instructions.`,
  });

  res.redirect("/forgotpassword");
};

exports.getResetPassword = async (req, res) => {
  const users = req.user;
  const user = await User.find({
    "token.resetPasswordToken": req.params.token,
    "token.resetPasswordExpires": { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", {
      msg: "Password reset token is invalid or has expired.",
    });
    return res.redirect("/forgotpassword");
  }

  res.render("resetpassword", {
    title: "Reset password",
    users,
  });
};

exports.postResetPassword = async (req, res, next) => {
  const validationErrors = [];
  const user = await User.find({
    "token.resetPasswordToken": req.params.token,
  });

  if (!user) {
    req.flash("error", {
      msg: "Password reset token is invalid or has expired.",
    });
    return res.redirect("/forgotpassword");
  }

  if (req.body.password !== req.body.confirmPassword) {
    validationErrors.push({ msg: "Passwords do not match" });
  }
  if (validationErrors.length) {
    req.flash("errors", { msg: validationErrors });
    return;
  }

  user.password = req.body.password;
  await User.updateOne(
    { _id: user[0]._id },
    { $set: { token: {} } },
    {
      new: true,
    }
  );

  const message = `
  This is a confirmation that the password for your account "${user.email}" has just been changed.
  `;

  sendEmail(user.email, "passwordreset@report.com", message);
  req.flash("success", { msg: `Success! Your password has been changed.` });

  res.redirect("/");
};
