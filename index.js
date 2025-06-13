import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// These two lines are needed when using ES Modules (type: "module" in package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded data (form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Temporary post storage (in-memory)
let posts = [];

// Home route - display all posts
app.get('/', function (req, res) {
    res.render('index', { posts });
});

// Handle new post submission
app.post('/posts', function (req, res) {
    console.log(req.body);
    posts.push(req.body);
    res.redirect("/");
});

// Delete a post by index
app.post('/delete', function (req, res) {
    posts.splice(req.body.del_index, 1);
    res.redirect('/');
});

// Edit a post - show edit form
app.post('/edit', function (req, res) {
    let index = req.body.index;
    res.render('edit', { x: index });
});

// Update a post after editing
app.post('/updated', function (req, res) {
    let update_data = req.body;
    posts[update_data.index].title = update_data.title;
    posts[update_data.index].description = update_data.description;
    res.redirect('/');
});

// Use Render's assigned port or default to 8080 for local dev
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
