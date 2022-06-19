const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Blog = require('./models/blog')


// connect to mongodb
const dbURI = process.env.DB_STRING
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err))

app.set('view engine', 'ejs')


// Middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))


//mongoose & mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });

    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => console.log(err))
})

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => console.log(err))
})

app.get('/single-blogs', (req, res) => {
    Blog.findById("62acc020be3b534aae51b8a1")
        .then((result) => {
            res.send(result)
        })
        .catch((err) => console.log(err))
})
// Home  Page
app.get('/', (req, res) => {
    res.redirect('/blogs')
})
// About page
app.get('/about', (req, res) => {
    res.render('about', {title : 'About'})
})
// Blog post
app.get('/blogs/create', (req, res) => {
    res.render('create', {title : 'Create a new Blog'})
})
// blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1 })
        .then((result) => {
            res.render('index', {title: 'All Blogs', blogs: result})
        })
})
// create blogs
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
      .then((result) => {
        res.redirect('/blogs')
      })
      .catch((err) => {
        console.log(err);
      })
})

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById()
      .then(result => {
        res.render('details',{ blog: result, title: 'Blog Details' })
      })
      .catch(err => {
        console.log(err)
      })
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' })
      })
      .catch(err => {
        console.log(err)
      })
})

// 404 page
app.use((req, res) => {
    res.status(404).render('404', {title : '404'})
})