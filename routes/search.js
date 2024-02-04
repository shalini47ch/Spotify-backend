const router = require("express").Router();

const { PlayList } = require("../models/playlist");
const { Song } = require("../models/song");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  const search = req.query.search; //this will help to perform the search query
  if (search !== "") {
    const songs = await Song.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    const playlists = await PlayList.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);
    const result = { songs, playlists };
    res.status(200).send(result);
  } else {
    res.status(200).send({});
  }
});

module.exports = router;
