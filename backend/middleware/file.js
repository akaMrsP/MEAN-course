const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// For more on multer - check out multer github!
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // even though we filter for png and jpg on the front-end, we are checking here, too, to be safe!
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); // this path is relative to the server.js file!
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({storage: storage}).single("image");
