const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ejsLayouts = require("express-ejs-layouts")
const morgan = require("morgan");
const methodOverride = require("method-override");
const flash = require("express-flash");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const mainRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");

require("dotenv").config({ path: "./config/.env" });

require("./config/passport")(passport);

connectDB();

// Middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Ejs templating engine
app.set("view engine", "ejs");
app.use(ejsLayouts);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Use forms for put / delete
app.use(methodOverride("_method"));

// Session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

app.use("/", mainRoutes);
app.use("/reports", reportRoutes);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} node on port ${PORT}`)
);

// 404 page
app.use("/error/404", (req, res, next) => {
  res.render("error/404", { title: "404", username: req.user })
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong!"
  res.status(errorStatus).render("error/404", { title: "404", username: req.user, error: {
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  },});
});

// Export the Express API
module.exports = app;
