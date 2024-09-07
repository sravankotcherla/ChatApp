const { User } = require("../models/user.model");
const mongoose = require("mongoose");
const async = require("async");

exports.searchUsers = (req, res) => {
  let { searchText } = req.query;
  searchText = `^${searchText}`;
  const searchRegExp = new RegExp(searchText, "i");
  User.aggregate([
    {
      $match: {
        username: { $regex: searchText, $options: "i" },
      },
    },
    {
      $lookup: {
        from: "chats",
        let: { user_id: "$_id" },
        pipeline: [
          {
            $match: {
              users: { $all: ["$$user_id", req.user._id] },
            },
          },
          {
            $project: { _id: 1 },
          },
        ],
        as: "chatsInfo",
      },
    },
    {
      $addFields: {
        chatInfo: { $arrayElemAt: ["$chatsInfo", 0] },
      },
    },
    {
      $project: { chatsInfo: 0 },
    },
  ])
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
