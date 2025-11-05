import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
  forum_id: { type: mongoose.Schema.Types.ObjectId, ref: "Forum", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Thread", ThreadSchema);