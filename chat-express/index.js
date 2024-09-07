const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const { authRouter } = require("./routes/auth.routes");
const AuthController = require("./controllers/auth.controller");
const ChatSocket = require("./socket/index");
const UserRouter = require("./routes/user.routes");
const ChatRouter = require("./routes/chat.routes");
const MessageRouter = require("./routes/messages.routes");

app = express();
var port = process.env.PORT;

app.use(
  cors({
    origin: process.env.allowedOrigins,
  })
);
app.use(bodyParser.json());

app.use("/auth/", authRouter);

app.use("/", AuthController.authCheck);
app.use("/users/", UserRouter);
app.use("/chats/", ChatRouter);
app.use("/messages/", MessageRouter);

app.get("/", (req, res) => {
  res.status(200).send("Chat backend is up");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
    ChatSocket.init(app, (server) => {
      server.listen(port, () => {
        console.log("App is up and listening on port ", port);
      });
    });
  })
  .catch((err) => {
    console.log("Failed to Connect to DB ", err);
  });
