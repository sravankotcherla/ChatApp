const express = require("express");
const MessageController = require("../controllers/message.controller");

const MessageRouter = express();

app.route("/").post(MessageController.postMessage);
