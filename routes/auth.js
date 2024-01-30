//this will check for the user credentials and check whether the details provided are corrct or not
//this is meant for sign up

const router = require("express").Router();

const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "Incorrect Username or password" });
  }
  //if we have the user then we compare the password
  const validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send({ message: "Incorrect password" });
  }
  //we will generate auth token in the case where both email and password are correct
  const token = user.generateAuthToken();
  return res
    .status(200)
    .send({ data: token, message: "Signin in progress please wait" });
});
module.exports = router;
