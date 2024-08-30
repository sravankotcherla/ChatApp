const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Async = require("async");

const ChatController = require("../controllers/chats.controller");
const MessageController = require("../controllers/message.controller");
const { Chat } = require("../models/chats.model");

exports.init = (app, cb) => {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.allowedOrigins,
    },
  });

  io.use((socket, next) => {
    if (socket.handshake.auth?.jwt) {
      jwt.verify(
        socket.handshake.auth.jwt,
        process.env.JWT_KEY,
        (err, decodedToken) => {
          if (err) {
            next(err);
          } else {
            socket.user = decodedToken;
            next();
          }
        }
      );
    } else {
      const err = new Error("User not authorized");
      err.data = "Missing Auth token";
      next(err);
    }
  });

  io.on("connection", (socket) => {
    console.log("Connection established successfully", socket);

    socket.on("message", async (messageInfo, chatId) => {
      const activeSockets = await io.fetchSockets();
      const receiverSocket = activeSockets.find(
        (socketItem) => socketItem?.user?._id === messageInfo?.to
      );
      if (receiverSocket) {
        receiverSocket.emit("message", messageInfo);
      }
      if (!chatId?.length) {
        const newChat = await Chat.create({
          users: [messageInfo.from._id, messageInfo.to],
          lastMessage: messageInfo.content,
          lastMessageDate: messageInfo.createdAt,
          unreadMessages: 1,
        });
        chatId = newChat.toJSON()._id.toString();
        const senderSocket = activeSockets.find(
          (socktItem) => socketItem?.user?._id === messageInfo?.from?._id
        );
        if (senderSocket) {
          senderSocket("newChat", newChat.toJSON());
        }
      }
      Async.parallel(
        {
          messaeg: function (callback) {
            return MessageController.createMessage(messageInfo, callback);
          },
        },
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent successfully", results);
          }
        }
      );
    });

    socket.on("disconnect", (socket) => {
      console.log(`socket got disconnected`);
    });
  });

  cb(httpServer);
};
