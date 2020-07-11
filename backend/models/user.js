const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  // unique does not act as a validator, BE CAREFUL!
  //    this is for mongoose and mongodb optimization ONLY
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// This plugin *will* generate an error if email is not unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
    // with a model of User, the collection will always be called users.
