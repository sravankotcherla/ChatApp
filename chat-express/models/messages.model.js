const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    from: {
      type: Object,
      required: true,
    },
    to: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    chatId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false }
);

exports.Message = mongoose.model("messages", MessageSchema);
