const express = require("express");
const chatController = require("../controller/chat.controll");
const router = express.Router();

router.post("/chat", chatController.addChat);
router.get("/chats", chatController.getChats);
router.get("/chat/:id", chatController.getChatById);
router.get("/chats/user/:userId", chatController.getChatsByUser);
router.put("/chat/:id", chatController.updateChat);
router.post("/chat/:id/message", chatController.addMessage);
router.delete("/chat/:id", chatController.deleteChat);

module.exports = router;