//this will have all the user schema
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
//these are used for authentication purposes

//now the next step is to create user schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  likedSongs: {
    type: [String],
    default: [],
  },
  playlists: {
    type: [String],
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//here adding the jwt token here
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      isAdmin: this.isAdmin,
    },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

//this will take of the validation of the user
//Joi is a npm package meant for performing validation
const validate = (user) => {
  //here adding the validation using joi
  const schema = Joi.object({
    name: Joi.string().min(5).max(10).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity().required(),
    month: Joi.string().required(),
    date: Joi.string().required(),
    year: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "non-binary").required(),
  });
  return schema.validate(user);
};

const User = mongoose.model("user", UserSchema);
module.exports = { User, validate };
