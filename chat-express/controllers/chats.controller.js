const { Chat } = require("../models/chats.model");
const Async = require("async");
const { User } = require("../models/user.model");
const mongoose = require("mongoose");

exports.getChats = (req, res) => {
  const chatsList = [];
  Async.waterfall(
    [
      function (done) {
        Chat.find({ users: { $in: req.user._id } })
          .sort({ lastMessageDate: -1 })
          .lean()
          .then((chatDocs) => {
            return done(
              null,
              chatDocs.map((item) => ({
                ...item,
                user_id: item.users.find((_id) => _id !== req.user._id),
              }))
            );
          })
          .catch((err) => {
            return done(err);
          });
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
  exports.updateChatDoc(req.body, function (err) {
    if (err) {
      return res.status(200).send(err);
    }
    return res.status(200).send("Updated Sucessfully");
  });
};

exports.updateChatDoc = (updatedFields, cb) => {
  let { lastMessage, lastMessageDate, unread, chatId } = updatedFields;
  const updateClause = { lastMessage, lastMessageDate };
  chatId = new mongoose.Types.ObjectId(chatId);
  Chat.updateMany({ _id: chatId }, { $set: updateClause, $inc: unread || 0 })
    .then(() => {
      return cb();
    })
    .catch((err) => {
      return cb(err);
    });
};

exports.createChat = (req, res) => {
  const chatUsers = req.body.users;
  Chat.create({ users: chatUsers })
    .then((newChat) => {
      return res.status(200).jsonp(newChat);
    })
    .catch((err) => {
      return res.status(500).send("Error while creating chat " + err);
    });
};
