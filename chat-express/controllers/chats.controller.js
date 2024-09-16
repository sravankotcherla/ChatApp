const { Chat } = require("../models/chats.model");
const Async = require("async");
const { User } = require("../models/user.model");
const mongoose = require("mongoose");
const { Message } = require("../models/messages.model");

exports.getChats = (req, res) => {
  const chatsList = [];
  Async.waterfall(
    [
      function (done) {
        Chat.aggregate([
          {
            $match: {
              users: { $in: [new mongoose.Types.ObjectId(req.user._id)] },
            },
          },
          {
            $lookup: {
              from: "messages",
              let: { chat_Id: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$$chat_Id", "$chatId"] } } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 },
                { $project: { type: 1, content: 1, createdAt: 1 } },
              ],
              as: "msgsInfo",
            },
          },
          {
            $addFields: {
              lastMessage: { $arrayElemAt: ["$msgsInfo.content", 0] },
              lastMessageDate: { $arrayElemAt: ["$msgsInfo.createdAt", 0] },
            },
          },
          {
            $project: { msgsInfo: 0 },
          },
          {
            $sort: { lastMessageDate: -1 },
          },
        ])
          .then((chatDocs) => {
            return done(
              null,
              chatDocs.map((item) => ({
                ...item,
                user_id: item.users.find(
                  (_id) => _id.toString() !== req.user._id
                ),
              }))
            );
          })
          .catch((err) => {
            return done(err);
          });
      },
      function (chats, done) {
        // Get unread messages of each chat
        const lastVisitedByUser = chats.map((chatItem) => ({
          _id: chatItem._id,
          lastVisitedAt: chatItem.lastVisitedAt?.[req.user._id],
        }));
        Async.concat(
          lastVisitedByUser,
          function (item, cb) {
            Message.countDocuments({
              chatId: item._id,
              to: new mongoose.Types.ObjectId(req.user._id),
              createdAt: { $gt: item.lastVisitedAt },
            })
              .then((unreadMsgsCount) => {
                return cb(null, {
                  _id: item._id.toString(),
                  count: unreadMsgsCount,
                });
              })
              .catch((err) => {
                return cb(err);
              });
          },
          function (err, results) {
            if (err) {
              return done(err);
            }
            results = results.reduce(
              (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
              {}
            );
            chats.forEach((chatItem) => {
              chatItem.unreadMessages = results[chatItem._id.toString()];
            });
            return done(null, chats);
          }
        );
      },
      function (chats, done) {
        const chatUsers = chats.reduce((accum, curr) => {
          if (!accum.includes(curr.user_id)) {
            accum.push(curr.user_id);
          }
          return accum;
        }, []);
        User.find(
          { _id: { $in: chatUsers } },
          { username: 1, id: 1, profileImg: 1, email: 1 }
        )
          .lean()
          .then((users) => {
            chats = chats.map((chatItem) => {
              const chatUser = users.find(
                (user) => user._id.toString() === chatItem.user_id.toString()
              );
              return { ...chatItem, user: chatUser };
            });
            return done(null, chats);
          })
          .catch((err) => {
            return done(err);
          });
      },
    ],
    function (err, chats) {
      if (err) {
        res.status(400).send(err);
      }
      return res.jsonp(chats);
    }
  );
};

exports.updateChat = (req, res) => {
  const chatId = new mongoose.Types.ObjectId(req.body.chatId);
  const updateClause = req.body.updatedBody;
  Chat.updateMany({ _id: chatId }, { $set: updateClause })
    .then(() => {
      return res.status(200).jsonp("Updated chat successfully");
    })
    .catch((err) => {
      return res.status(500).send("Failed to update chat ", err);
    });
};

exports.createChat = (req, res) => {
  const chatUsers = req.body.users;
  const lastVisitedAt = req.body.visitedAt;
  const currUserId = req.user._id.toString();
  const otherUserId = chatUsers.find((item) => item !== currUserId);
  const newChatBody = {
    users: chatUsers,
    lastVisitedAt: {
      [currUserId]: new Date(lastVisitedAt),
      [otherUserId]: new Date(lastVisitedAt),
    },
  };
  Chat.create(newChatBody)
    .then((newChat) => {
      return res.status(200).jsonp(newChat);
    })
    .catch((err) => {
      return res.status(500).send("Error while creating chat " + err);
    });
};
