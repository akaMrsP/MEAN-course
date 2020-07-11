const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

// All of our user requests are in this file to keep them separate from other requests
const router = express.Router();

// Relative to /api/user, as set in the app.js file
router.post("/signup", (req, res, next) => {
  // Hash the user's password, BEFORE storing it!
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // create a new user and store it in the database
      const user = new User({
        email: req.body.email,
        // This is super, MEGA bad - this would store the password in its unencrypted form!!!
        // password:req.body.password
        // HASH the password instead!
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

// /api/user/login
router.post("/login", (req, res, next) => {
  let fetchedUser;
  // if credentials are valid, then validate the user
  // Does the email address exist?
  User.findOne({ email: req.body.email })
    .then(user => {
      // console.log(user);
      if (!user) {
        // this user does not exist in the database
        //    we return, because there is code after the response
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      // this user exists, check the hashed password (asynch)
      // compare the hash of the entered password with the hashed password stored in the database
      return bcrypt.compare(req.body.password, fetchedUser.password);
    })
    .then(result => {
      // console.log(result);
      // password check was not successful
      if (!result) {
        return res.status(401).json({ // return prevents execution of code following the if statement.
          message: "Auth failed"
        });
      }
      // If we made it here, we have an existing user with a valid password!
      //  Create a JSON Web Token for the user (do NOT send the password to the user!!!)
      //  secret is used to hash the password, tokens should expire for security reasons (it is stored on the client)
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: "1h" }
      );
      // console.log(token);
      res.status(200).json({   // no return necessary, this is the last action
        token: token,
        expiresIn: 3600,   // duration until token expiry, in seconds
        userId: fetchedUser._id   // also in the token, but faster and easier to add to the response
      });
    })
    .catch (err => {
        // console.log(err);
        // password process generated an error
        return res.status(401).json({
          message: "Auth failed"
        });
    });
});

module.exports = router;
