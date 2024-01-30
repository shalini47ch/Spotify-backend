require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const authRoutes=require("./routes/auth")
const port = process.env.PORT || 8080;
const app = express();
const connection = require("./db");
connection();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/login",authRoutes);

app.listen(port, console.log(`Server running on port ${port}`));
