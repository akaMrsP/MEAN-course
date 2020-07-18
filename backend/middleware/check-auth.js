const jwt = require("jsonwebtoken");

// check if there is a token attached to the request
// check if an existing token is valid

module.exports = (req, res, next) => {
  // token header often looks like "Bearer er38473483"
  //    so we split on the white space and grab the second element - the token itself
  try {
    const token = req.headers.authorization.split(" ")[1];    // could also use a query param
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);  // same secret as in user.js to verify
    // add user information to the request (be careful not to overwrite existing request information)
    //      our post needs this information for authorization
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401). json({ message: "You are not authenticated!" });
  }
};
