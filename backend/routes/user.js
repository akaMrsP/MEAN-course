const express = require('express');

const UserController = require('../controllers/user');

// All of our user requests are in this file to keep them separate from other requests
const router = express.Router();

// Relative to /api/user, as set in the app.js file
router.post("/signup", UserController.createUser);

// /api/user/login
router.post("/login", UserController.userLogin);

module.exports = router;
