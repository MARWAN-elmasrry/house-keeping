const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    messages: [
      {
        sender: { type: String, enum: ["user", "seller"]},
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Chat", chatSchema);
  