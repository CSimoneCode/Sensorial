
// connection to server
const express = require('express');
const app = express();

// 3rd party modules
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');

require('dotenv').config();
const PORT = process.env.PORT || 4000;

// set view engine
app.set('view engine', 'ejs');

// CONTROLLERS
const ctrl = require('./controllers');

// Custom middleware - checking who is logged in and 
// granting views access too that user's document.
app.use((req, res, next) => {
  db.User.findOne({isLoggedin: true}, (err, foundUser) => {
    if (err) return console.log(err);
    user = foundUser;
    res.locals.user = req.user;
  });
  next();
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan(':method :url'));


// Connect to database
const db = require('./models');

// ------------------------------------------------------ Routes

// Root route (landing page)
app.get('/', (req, res) => {
  res.render('./landing');
});

// About route
app.get('/about', (req, res) => {
  res.render('./about');
});

// Contact route
app.get('/contact', (req, res) => {
  res.render('./contact');
});

// POST Create user (sign up modal)
app.post('/', (req, res) => {
  db.User.create(req.body, (err, newUser) => {
    if (err) return console.log(err);
  });
});

// GET Current Prompt / Activities Index
app.get('/currentprompt', (req, res) => {
  res.redirect('activities');
});

// GET Logout (updates current user 'isloggedin' to false)
app.get('/logout', (req, res) => {
  db.User.findOneAndUpdate({isLoggedin: true}, {isLoggedin: false}, 
    {new: true}, (err, foundUser) => {
    if (err) return console.log(err);
    res.redirect('/');
  });
});


// Routes
app.use('/users', ctrl.users);
app.use('/activities', ctrl.activities);

//Listener
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
