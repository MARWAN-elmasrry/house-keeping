const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "moderator"], default: "moderator" },
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Admin", adminSchema);
  