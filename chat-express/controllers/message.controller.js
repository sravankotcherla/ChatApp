const { Message } = require("../models/messages.model");
exports.postMessage = (req, res) => {
  const messageBody = req.body;
  exports.createMessage(messageBody, function (err) {
    if (err) {
      return res
        .status(400)
        .send({ message: "Error while creating Message", error: err });
    }
    return res.status(200).send("Created Successfully");
  });
};

exports.createMessage = (messageBody, cb) => {
  Message.create(messageBody)
    .then(() => {
      return cb(null);
    })
    .catch((err) => {
      return cb(err);
    });
};

exports.getChatMessages = (req, res) => {
  const { chatId, skipNumber } = req.query;
  Message.find({
    chatId: chatId,
  })
    .sort({ createAt: -1 })
    .skip(skipNumber)
    .limit(20)
    .lean()
    .then((msgs) => {
      return res.jsonp(msgs);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};
