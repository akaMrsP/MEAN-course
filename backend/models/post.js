const mongoose = require('mongoose');

// notice the String type is capitalized (javascript & Node.js) - typescript is the lower case string
const postSchema = mongoose.Schema({      // Schema is just a blueprint
  title: { type: String, required: true },  // can add more than just the datatype!
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});   // id will be generated automatically by mongoose :)

// to create data (models/objects) based on the blueprint (schema), we need to define a model
//  (schema = class, model = object) ?????????????
module.exports = mongoose.model('Post', postSchema);
    // with a model of Post, the collection will always be called posts.
