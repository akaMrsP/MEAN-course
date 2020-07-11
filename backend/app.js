const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Have to import the posts.js router object, so the backend app knows about those post requests
const postsRoutes = require('./routes/posts');

// Have to import the user.js router object, so the backend app knows about user requests
const userRoutes = require('./routes/user');

const app = express();

// mongoose.connect('mongodb+srv://amy:8Yg4fNLRPLozfphI@cluster0.vxgaa.mongodb.net/node-angular?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://amy:8Yg4fNLRPLozfphI@cluster0.vxgaa.mongodb.net/node-angular')
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });

// add middleware
// arguments are as many filters (or other middleware) as you want,
//      and the last argument is the function which handles the request

// don't filter for a specific path because we want to do this for all incoming requests
app.use(bodyParser.json());   // allows us to parse the json
app.use(bodyParser.urlencoded({ extended: false })); // used to allow us to parse urlencoded data, extended: false for default features

// any requests targeting images/ will be allowed permission to continue, and fetch their files.
//  /images is actual in the backend/ folder, so we need to map it
app.use("/images", express.static(path.join("backend/images")));

// middleware to allow outside clients to use our APIs
app.use((req, res, next) => {
  // Setting ACAO to '*' means no matter *which domain* the client runs on, it is allowed access to our resources
  res.setHeader('Access-Control-Allow-Origin', '*');  // key-value pair to modify the response header for the browser

  // above we allowed all domains - here we *allow extra headers* beyond the default
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // here we control *which http verbs* can be used in a request
  //      OPTIONS is an implicit request used to check that a POST request is valid *before* executing the POST request
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS'); // PUT could also be added, if you will be using it

  next(); // don't forget to pass on to the next middleware!
});

// gives us access to all the posts requests
//    first parameter filters for the route starter for all requests in postsRoutes!
app.use('/api/posts', postsRoutes);

// gives us access to all the user requests
app.use('/api/user', userRoutes);

// Export the *entire* app (includes all the middleware)
module.exports = app;
