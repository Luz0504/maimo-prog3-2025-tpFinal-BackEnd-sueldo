import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  joined_at: { type: Date, default: Date.now },
  role: { type: String, default: "user" },
});

export default mongoose.model("User", UserSchema); 