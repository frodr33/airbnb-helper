const jwt = require('jsonwebtoken');
const secret = 'tripitsecret';

const withAuth = function(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    console.log("Not Authorized")
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        console.log("Not Authorized")
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        console.log("Authorized");
        next();
      }
    });
  }
}
module.exports = withAuth;