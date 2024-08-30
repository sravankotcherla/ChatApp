const { User } = require("../models/user.model");
const mongoose = require("mongoose");

exports.searchUsers = (req, res) => {
  const searchText = req.query;
  const searchRegExp = new RegExp(searchText, "i");
  User.find({ username: searchRegExp })
    .lean()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(400).send({
        error: err,
        message: "Error while fetching users with search text",
      });
    });
};

exports.getSessionInfo = (req, res) => {
  const user_id = new mongoose.Types.ObjectId(req.user?._id);
  if (!user_id) {
    return res.status(400).send("Missing user info in req object");
  }
  User.findOne({ _id: user_id }, { password: 0 })
    .lean()
    .then((userInfo) => {
      return res.status(200).jsonp(userInfo);
    })
    .catch((err) => {
      return res
        .status(400)
        .send({ error: err, message: "Error while fetching session info" });
    });
};
