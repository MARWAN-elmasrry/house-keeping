const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'in progress', 'completed'],
      default: 'pending'},
      createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model("Service", serviceSchema);
  