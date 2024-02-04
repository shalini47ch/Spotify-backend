const mongoose = require("mongoose");
module.exports = (req, res, next) => {
  //here we are checking if the object id is valid or not
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send({ message: "Invalid Id" });
  }
  next();
};
