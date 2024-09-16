const express = require("express");

const ChatController = require("../controllers/chats.controller");

const ChatRouter = express();

ChatRouter.route("/").get(ChatController.getChats);
ChatRouter.route("/create").post(ChatController.createChat);
ChatRouter.route("/update").post(ChatController.updateChat);

module.exports = ChatRouter;
