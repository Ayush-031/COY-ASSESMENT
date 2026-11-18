import mongoose from "mongoose";

const swipeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
  action: { type: String, enum: ["like", "pass"], required: true }
}, { timestamps: true });

swipeSchema.index({ userId: 1, profileId: 1 }, { unique: true });
export default mongoose.model("Swipe", swipeSchema);
