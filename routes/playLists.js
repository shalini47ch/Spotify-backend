const router = require("express").Router();
const { PlayList, validate } = require("../models/playlist");
const { Song } = require("../models/song");

//we also need to import the user models as we will perform functionalities based on that user
const { User } = require("../models/user");
//now the next step is to import the middleware
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validObjectId = require("../middleware/validObjectId");
const Joi = require("joi");
//the first step is to create a playlist
//user ke pass hai ek playlists array jisme songs push karna hai
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  //here we will first find the user with a specific id
  const user = await User.findById(req.user._id);
  const playList = await PlayList({ ...req.body, user: user._id }).save(); //here we have created a new playlist now add this in the playlist array of users
  user.playlists.push(playList._id);
  await user.save();
  res.status(201).send({ data: playList });
});

//now similarly create a put request to edit the playlist with a specific id
router.put("/edit/:id", [validObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().allow(""),
    img: Joi.string().allow(""),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  const playlist = await PlayList.findById(req.params.id);
  if (!playlist) {
    return res.status(401).send({ message: "Playlist not found" });
  }
  //similarly find the user by the id
  const user = await User.findById(req.user._id);
  if (!user._id.equals(playlist.user)) {
    res
      .status(401)
      .send({ message: "User doesnt have permission to edit the playList" });
  }
  playlist.name = req.body.name;
  playlist.desc = req.body.desc;
  playlist.img = req.body.img;
  await playlist.save();
  res.status(200).send({ message: "Playlist updated successfully" });
});

//add song to the playlist
router.put("/add-song", auth, async (req, res) => {
  //here is the schema which we are creating to perform validation
  const schema = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  //now here doing it for playlist id and song id
  const user = await User.findById(req.user._id);
  const playlist = await PlayList.findById(req.body.playlistId);
  if (!user._id.equals(playlist.user)) {
    return res.status(403).send({ message: "User dont have access to add" });
  }
  //if the index of the songId is -1 then we put that in the playlist as that song doesnt exist
  if (playlist.songs.indexOf(req.body.songId) === -1) {
    playlist.songs.push(req.body.songId);
  }
  await playlist.save();
  res.status(200).send({ data: playlist, message: "Added to playlist" });
});

//here we need to remove the song fromthe playlist
router.put("/remove-songs", auth, async (req, res) => {
  const schema = Joi.object({
    playlistId: Joi.string().required(),
    songId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  //here we will find the user and the playlist and if the index is -1 then remove the song frommthe playlist
  const user = await User.findById(req.user._id);
  const playlist = await PlayList.findById(req.body.playlistId);
  //now check if the user id is equal to playlist user or not
  if (!user._id.equals(playlist.user)) {
    return res.status(403).send({ message: "User dont have access to remove" });
  }
  index = playlist.songs.indexOf(req.body.songId);
  //now the next step is to remove the playlist
  playlist.songs.splice(index, 1);
  //now the next step is to save it
  await playlist.save();
  res.status(200).send({ message: "Removed from the playlist successfully" });
});

//now we need to find the playlist of the user
router.get("/favorite", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  //here we need to find the playlists for that specific user we are sending
  const playlists = await PlayList.find({ _id: user.playlists });
  res.status(200).send({ data: playlists });
});

//now the next one is to get the playlist by id
router.get("/:id", [validObjectId, auth], async (req, res) => {
  const playlist = await PlayList.findById(req.params.id);
  if (!playlist) {
    return res.status(404).send({ message: "Not found" });
  }
  const songs = await Song.find({ _id: playlist.songs });
  res.status(200).send({ data: { playlist, songs } });
});

//now the next one is to get all the playlists
router.get("/", auth, async (req, res) => {
  const playlists = await PlayList.find();
  res.status(200).send({ data: playlists });
});

//get the random playlist of songs
router.get("/random", auth, async (req, res) => {
  const playlists = await PlayList.aggregate([{ $sample: { size: 10 } }]);
  res.status(200).send({ data: playlists });
});

//delete user with a specific id
router.delete("/:id", [validObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  //now the next step is to find the playlist
  const playlist = await PlayList.findById(req.params.id);
  if (!user._id.equals(playlist.user)) {
    return res
      .status(403)
      .send({ message: "user doesn't have access to delete" });
  }
  const index = user.playlists.indexOf(req.params.id);
  user.playlists.splice(index, 1); //here it is deleted
  await user.save();
  //this is meant to delete data from the database
  await playlist.deleteOne();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
