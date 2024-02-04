//here we will need the object id to create the playlist schema
const mongoose = require("mongoose");

const Joi = require("joi");

//we need to obtain the objectId from the user
const ObjectId = mongoose.Schema.Types.ObjectId;

//now create the song schema
const PlayListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: ObjectId, ref: "user", required: true },
  desc: { type: String },
  //the type of songs will be of the form of the array
  songs: { type: Array, default: [] },
  img: { type: String },
});

//here we will perform the validation for the schema
const validate = (playList) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required(),
    desc: Joi.string().allow(""),
    songs: Joi.array().items(Joi.string()),
    img: Joi.string().allow(""),
  });
  return schema.validate(playList);
};

const PlayList = mongoose.model("Playlist", PlayListSchema);
module.exports = {
  PlayList,
  validate,
};
