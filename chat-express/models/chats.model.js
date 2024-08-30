const express = require("express");
const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  users: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
  lastMessage: {
    type: String,
    default: "",
  },
  lastMessageDate: {
    type: Date,
    default: "",
  },
  unreadMessages: {
    type: Number,
    default: 0,
  },
});

exports.Chat = mongoose.model("chats", ChatSchema);
