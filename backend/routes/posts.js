const express = require('express');
// moved all the middleware multer stuff into the middleware folder

const PostController = require('../controllers/posts');

// route protected behind authorization middleware!!!
const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file');

// Moved all of our post requests into this file to keep them separate from other requests,
//    such as authentication  (function bodies have been moved into the controllers folder)

const router = express.Router();

// middleware to allow access to posts

// remove /api/posts from all requests, because we already filtered for this in app.js before coming here
router.post('', checkAuth, extractFile, PostController.createPost);

// use mongoose to update the post with its new value(s)
router.put('/:id', checkAuth, extractFile, PostController.updatePost);

router.get('', PostController.getAllPosts);  // app.get could be app.use instead

router.get('/:id', PostController.getOnePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;


//router.get('', (req, res, next) => { // to reach this code, we have to target this path (/api/posts)
  // const posts = [
    //   {
      //     id: 'dklfdsfd23434',
      //     title: 'First server-side post',
      //     content: 'This is coming from the server!'
      //   },
      //   {
        //     id: 'sdfj3784564',
        //     title: 'Second server-side post',
        //     content: 'This is also coming from the server!!'
        //   }
        // ];
//}
