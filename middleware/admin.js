const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(400).send({ message: "Access denied no token provided" });
  }
  //now the other case is where we have a valid token
  jwt.verify(token, process.env.SECRET_KEY, (error, validToken) => {
    if (error) {
      //here we need to return the response as we got invalid token
      return res.status(400).send({ message: "Invalid token" });
    } else {
      if (!validToken.isAdmin) {
        return res
          .status(400)
          .send({ message: "You dont have access to this content" });
      }
      req.user = validToken;
      next();
    }
  });
};
