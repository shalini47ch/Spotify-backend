//here we need to perform the routing for our apps
const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validObjectId = require("../middleware/validObjectId");

//import the user and validate from the models folder
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

//here we need to create a new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(403).send({ message: error.details[0].message });
  }
  //here we will find the user with a specific email
  const user = await User.findOne({ email: req.body.email });
  //now the next step is to see if this user already exists or we need to create a new user
  if (user) {
    return res.status(403).send({ message: "User already exists" });
  }
  //this is meant for hashing of password and salting is done so that password wont be attacked
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //here if it is not the case then we create a new user
  let newUser = await new User({
    ...req.body,
    password: hashPassword,
  }).save();

  //this line is written so that we dont have to pass the password from the client side
  newUser.password = undefined;
  newUser.__v = undefined;
  res.status(200).send({ data: newUser, message: "User created successfully" });
});

//now the next one is to get all the users
router.get("/", admin, async (req, res) => {
  const users = await User.find().select("-password -__v");
  res.status(200).send({ data: users });
});

//now we need to get the users by their specific id
router.get("/:id", [validObjectId, auth], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  res.status(200).send({ data: user });
});

//now the next one is to update the user by the specific id
//select is mainly used to consider the case where we dont need to send the password
router.put("/:id", [validObjectId, auth], async (req, res) => {
  //here we will first find the user by specific id and update
  //$set is meant to update the the user with the specific id
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  ).select("-password -__v");
  res
    .status(200)
    .send({ data: user, message: "User updated with specific id" });
});

//to get a specific id use req.params.id
//here we will delete a user by the specific id
router.delete("/:id", [validObjectId, auth], async (req, res) => {
  //here find the user with the specific id and delete
  await User.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .send({ message: "User with specific id deleted successfully" });
});

module.exports = router;
