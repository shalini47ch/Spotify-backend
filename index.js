require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes=require("./routes/auth")
const songRoutes=require("./routes/song")
const playListRoutes = require("./routes/playLists");
const searchRoutes=require("./routes/search")
const port = process.env.PORT || 8080;
const app = express();
const connection = require("./db");
connection();

app.use(cors());
app.use(express.json());
app.use("/api/users/", userRoutes);
app.use("/api/login/",authRoutes);
app.use("/api/songs/",songRoutes);
app.use("/api/playlists/",playListRoutes)
app.use("/api/",searchRoutes)



app.listen(port, console.log(`Server running on port ${port}`));
