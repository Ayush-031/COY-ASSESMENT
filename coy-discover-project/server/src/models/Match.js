import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true }
}, { timestamps: true });

matchSchema.index({ userId: 1, profileId: 1 }, { unique: true });
export default mongoose.model("Match", matchSchema);
