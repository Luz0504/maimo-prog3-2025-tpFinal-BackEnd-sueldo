import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  joined_at: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema); 