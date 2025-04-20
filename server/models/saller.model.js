const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    role: { 
        type: String, 
        required: true, 
        default: 'seller', 
    },
    services: [{ type: String , ref: "Service" }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Seller", sellerSchema);
  