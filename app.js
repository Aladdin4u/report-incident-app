const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan')
const methodOverride = require('method-override')
const flash = require("express-flash");
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const mainRoutes = require('./routes/auth')
const repRoutes = require('./routes/reports')



require('dotenv').config({ path: "./config/.env" })

require('./config/passport')(passport)

connectDB()

// Middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))

// Set Ejs templating engine
app.set("view engine", "ejs");

// Logging
app.use(morgan('dev'))

//Use forms for put / delete
app.use(methodOverride("_method"));

const clientP = mongoose.connect(
  'mongodb+srv://aladdin:test1234@nodeblog.plyzua2.mongodb.net/nodeblogtuts?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(m => m.connection.getClient())

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: clientP })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Use flash messages for errors, info, ect...
app.use(flash());

app.use('/', mainRoutes)
app.use('/reports', repRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} node on port ${PORT}`))

// 404 page
app.use((req, res) => {
  res.status(404).render('error/404', {title : '404'})
})

// Export the Express API
module.exports = app;