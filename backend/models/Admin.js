import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },   // "owner" | "admin"
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

export default mongoose.model("Admin", adminSchema);