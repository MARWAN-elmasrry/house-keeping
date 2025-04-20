const Chat = require("../models/chat.model");

const addChat = async (req, res) => {
  try {
    const { service, user, seller, messages } = req.body;
    
    const newChat = new Chat({
      service,
      user,
      seller,
      messages: messages || []
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("service", "title price")
      .populate("user", "username email")
      .populate("seller", "username email");
    
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate("service", "title price")
      .populate("user", "username email")
      .populate("seller", "username email");
    
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chats = await Chat.find({ user: userId })
      .populate("service", "title price")
      .populate("seller", "username email");
    
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChat = async (req, res) => {
  try {
    const { service, user, seller, messages } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { service, user, seller, messages },
      { new: true }
    );
    
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;
    
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    
    const newMessage = {
      sender,
      text,
      timestamp: new Date()
    };
    
    chat.messages.push(newMessage);
    await chat.save();
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const deletedChat = await Chat.findByIdAndDelete(req.params.id);
    
    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addChat,
  getChats,
  getChatById,
  getChatsByUser,
  updateChat,
  addMessage,
  deleteChat
};