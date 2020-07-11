const express = require('express');

// handle a request for a single special path only
const app = express();  // create an express app, and store a reference to it

// add middleware
app.use((req, res, next) => {
  console.log('First middleware');  // do something
  next();                 // continue your journey!
      // without next or returning a response, the browser will load indefinitely (or until timeout)
});

// Next sends us here
app.use((req, res) => {
  // do more, no next() means journey ends here
  console.log('Second middleware');

  // more powerful version of response, also implicitly "ends" response (does everything for us)
  res.send('Hello from express!');
});

// Just need to wire this Express app with our Node server (export here, import in the server file)
module.exports = app;   // Export the *entire* app (includes all the middleware)
