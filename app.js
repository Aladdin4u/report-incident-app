const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const blogRoutes = require('./routes/blogRoutes')
const bodyParser = require('body-parser');
require('dotenv').config()


// connect to mongodb
const dbURI = process.env.DB_STRING
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    app.listen(2022)
    console.log('connected to database') 
  })
  .catch((err) => console.log(err))

app.set('view engine', 'ejs')


// Middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({ extended: false }))

// Set Ejs templating engine
app.set("view engine", "ejs");


// Home  Page
app.get('/', (req, res) => {
  res.redirect('/blogs')
})
// About page
app.get('/about', (req, res) => {
    res.render('about', {title : 'About'})
})
// Blog post
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', {title : '404'})
})