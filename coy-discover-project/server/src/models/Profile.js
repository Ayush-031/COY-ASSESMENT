import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  photo: { type: String, required: true },
  bio: { type: String, required: true },
  location: { type: String, required: true },
  interests: [{ type: String }],
  likedBy: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
