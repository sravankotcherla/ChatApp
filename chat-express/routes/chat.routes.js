const express = require("express");

const ChatController = require("../controllers/chats.controller");

const ChatRouter = express();

ChatRouter.route("/").get(ChatController.getChats);

module.exports = ChatRouter;
