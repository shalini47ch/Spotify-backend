const router = require("express").Router();
const { User } = require("../models/user");
//similarly import the song schema and the validate function

const { Song, validate } = require("../models/song");
//next step is to import the middleware
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validObjectId = require("../middleware/validObjectId");

router.post("/", admin, async (req, res) => {
  //here we will validate and then check for errors
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  //in case there is no error then we create a new song
  const song = await Song(req.body).save();
  //once the song is created then create a status code of 200 with a message of song created successfully
  res.status(201).send({ data: song, message: "Song created successfully" });
});

//now the next step is to get the songs
router.get("/", async (req, res) => {
  const songs = await Song.find();
  res.status(200).send({ data: songs });
});

//now the next step is to update the songs by specific id
router.put("/:id", [validObjectId, admin], async (req, res) => {
  const songs = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(201).send({ data: songs, message: "Song updated successfully" });
});

//other one is to delete the user by specific id

router.delete("/:id", [validObjectId, admin], async (req, res) => {
  const songs = await Song.findByIdAndDelete(req.params.id);
  res.status(200).send({
    data: songs,
    message: "Song with specific id deleted successfully",
  });
});

//like song
router.put("/like/:id", [validObjectId, admin], async (req, res) => {
  let resMessage = "";
  const songs = await Song.findById(req.params.id);
  //if the song is not found then return song not found
  if (!songs) {
    res.status(401).send({ message: "Song doesn't exists" });
  }
  const user = await User.findById(req.user._id);
  // likedSongs this is an array we are provided with in the schema
  const index = user.likedSongs.indexOf(songs._id);
  //now checking for the conditions where the index==-1 or not  if it is -1 then we put it in liked songs
  if (index == -1) {
    //if index==-1 means that song doesn't exist so put it in the likedArray
    user.likedSongs.push(songs._id);
    resMessage="Added to liked songs"
  } else {
    //if that index already exists then remove it
    user.likedSongs.splice(index, 1);
    resMessage = "Removed it from your liked songs";
  }
  await user.save();
  res.status(200).send({ message: resMessage });
});

//we need to get all the liked songs
router.get("/like", auth, async (req, res) => {
  //first we will find the user for whom we need to find the liked songs
  const user = await User.findById(req.user._id);
  //now the next step is to find the list of songs that are liked by the user
  const songs = await Song.find({ _id: user.likedSongs });
  //now the next step is to send the response status along with the data
  res.status(200).send({ data: songs });
});

module.exports = router;
