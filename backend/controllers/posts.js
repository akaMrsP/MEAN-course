// Post Model - convention is to capitalize an object based on a Schema
const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");

  // can't store - so can't persist yet
  // const post = req.body;     // req.body added by bodyParser
  // console.log(post);

  // connecting to the database, baby!
  //     id will be generated automatically by mongoose :)
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  // saves post as a new document in the database - thank you mongoose!
  post.save().then(createdPost => {
    // console.log(result);
    res.status(201) // 201: everything is okay, new resource created
      .json({       // return json data
        message: 'Post added successfully',
        // postId: createdPost._id     // updating the front-end value of the id property (initially null)
        post: {
          id: createdPost._id,        // could have just passed the post, but we want to remap the id.
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
        }
        // OR use fancy new javascript to use spread operator for anything that maps directly
        //   hmmmm... BEWARE!!!  See Udemy Course Q&A: https://www.udemy.com/angular-2-and-nodejs-the-practical-guide/learn/v4/questions/4851476
        // post: {
        //   ...createdPost,           // grab everything, and...
        //   id: createdPost._id       // ...remap just the id
        // }
      });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  });
}

exports.updatePost = (req, res, next) => {
  // console.log(req.file);  // req.file is undefined if we are submitting a string
  let imagePath = req.body.imagePath;
  if (req.file) {
    // a new file was uploaded, we can use the post route information
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  // console.log(post);
  // Only update the post if *both* the post id and the creator id match
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      // console.log(result);
      // result.n is only greater than zero if we are authorized, whether or not we modified anything (nModified > 0)
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    // only catches technical errors
    .catch(error => {
      res.status(500).json({
        message: "Could not update post!"
      });
    });
}

exports.getAllPosts = (req, res, next) => { // to reach this code, we have to target this path (/api/posts)
  // grab the parsed query parameter information
  //    the parameters are conveniently parsed for us!
  // console.log(req.query);
  const pageSize = +req.query.pagesize;  // string by default - make sure it is a number or .limit won't work later
  const currentPage = +req.query.page;
  let fetchedPosts;

  // returns *all* entries by default, can be configured to narrow down results (see conditional below)
  //      for more info on find(), see mongoose docs -> Queries
  const postQuery = Post.find();  // will not be executed until .then(), allowing for custom query building

  // adjust the postQuery if we need to narrow down results
  if (pageSize && currentPage) {
    // caution for very large datasets: this still executes on the entire data set!
    //    see Udemy course pagination (module 7) lecture for possible workarounds
    postQuery
      .skip(pageSize * (currentPage - 1))   // skip items on earlier pages
      .limit(pageSize);  // limits the amount of documents that we return
  }

  postQuery
    .then(documents => {  // use .then to avoid callback hell
      fetchedPosts = documents;   // needed to allow access to documents in the following .then() call
      return Post.count();
    })
    .then(count => {
      // return data in a JSON format (no need to call return)
      // response needs to be *inside* the then callback, or the code will *not* wait for the
      //  find() & count() before executing the status!
      res.status(200).json({    // 200: everything is okay
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
   })
   .catch(error => {
     res.status(500).json({
       message: "Fetching posts failed!"
     });
   });
  // do *not* call next, because we are returning!  There is no more middleware that we want to execute.
}

exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
}

exports.deletePost = (req, res, next) => {
  // console.log(req.params.id);
  // deleteMany or deleteOne options
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Post deleted!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
}
