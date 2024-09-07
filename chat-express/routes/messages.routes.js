const express = require("express");
const MessageController = require("../controllers/message.controller");

const MessageRouter = express();

MessageRouter.route("/").post(MessageController.postMessage);
MessageRouter.route("/getChatMsgs").get(MessageController.getChatMessages);

module.exports = MessageRouter;
