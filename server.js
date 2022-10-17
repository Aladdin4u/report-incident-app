const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    //set header content-type
    res.setHeader('content-Type', 'text/html')
    let path = './views/';
    switch(req.url) {
        case '/' :
            path += 'index.html';
            res.statusCode = 200;
            break;
        case '/about' :
            path += 'about.html';
            res.statusCode = 200;
            break;
        case '/about-me' :
            res.statusCode = 301;
            res.setHeader('Location', '/about');
            res.end();
            break;
        default:
            path += '404.html';
            res.statusCode = 404;
            break;
    }

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err)
            res.end()
        } else {
            res.write(data)
            res.end()
        }
    })
})
<div class="reports">
        <h2>Some Reports</h2>
        <% if (reports.length > 0) { %>
            <% reports.forEach(report => { %>
                
                <a class="single" href="/reports/<%= report._id %>">
                    <h3 class="title"><%= report.title %></h3>
                    <p class="snippet">Written by: <%= report.user.userNAme %></p>
                </a>

            <% }) %>
            
        <% } else { %>
            <p>There is no reports to display...</p>
        <% } %>
     </div>
/* <script>
        const trashcan = document.querySelector('a.delete');
        trashcan.addEventListener('click', (e) => {
            const endpoint = `/reports/${trashcan.dataset.doc}`;

            fetch(endpoint, {
                method: 'DELETE'
            })
              .then((response) => response.json())
              .then((data) => window.location.href = data.redirect)
              .catch(err => console.log(err))
        })
</script> */

{/* <div class="details">
        <h2><%= report.title %> <span><%= report.createdAt.toLocaleString() %></span></h2>
       <div class="content">
        <p><%= report.body %></p>
       </div>
       <a class="delete" data-doc="<%= report._id %>">delete</a>
</div> */}

//mongoose & mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: 'new blog 2',
//         snippet: 'about my new blog',
//         body: 'more about my new blog'
//     });

//     blog.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// })

// app.get('/all-blogs', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// })

// app.get('/single-blogs', (req, res) => {
//     Blog.findById("62acc020be3b534aae51b8a1")
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// })


server.listen(3000, 'localhost', () => {
    console.log('listening for request on port 3000')
})