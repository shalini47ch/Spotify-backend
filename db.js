const mongoose = require("mongoose");

//now to use it in the index.js we need to export it
module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(process.env.DB, connectionParams);
    console.log("Database connected successfully");
  } catch {
    console.log("Error while connecting to the database");
  }
};
