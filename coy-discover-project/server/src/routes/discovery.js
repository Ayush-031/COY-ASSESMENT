import { Router } from "express";
import mongoose from "mongoose";
import Profile from "../models/Profile.js";
import Swipe from "../models/Swipe.js";
import Match from "../models/Match.js";

const router = Router();
const DEMO_USER_ID = "demo-user";

router.get("/feed", async (req, res, next) => {
  try {
    const swiped = await Swipe.find({ userId: DEMO_USER_ID }).distinct("profileId");
    const profiles = await Profile.find({
      _id: { $nin: swiped }
    }).select("name age photo bio location interests").lean();

    res.json({ profiles });
  } catch (error) { next(error); }
});

router.post("/swipe", async (req, res, next) => {
  try {
    const { profileId, action } = req.body;
    if (!mongoose.isValidObjectId(profileId)) {
      return res.status(400).json({ message: "A valid profileId is required." });
    }
    if (!["like", "pass"].includes(action)) {
      return res.status(400).json({ message: 'action must be "like" or "pass".' });
    }

    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found." });
    const existing = await Swipe.findOne({ userId: DEMO_USER_ID, profileId });
    if (existing) {
      return res.status(409).json({ message: "You have already swiped on this profile." });
    }

    await Swipe.create({ userId: DEMO_USER_ID, profileId, action });

    let isMatch = false;
    let match = null;
    if (action === "like" && profile.likedBy.includes(DEMO_USER_ID)) {
      match = await Match.findOneAndUpdate(
        { userId: DEMO_USER_ID, profileId },
        { $setOnInsert: { userId: DEMO_USER_ID, profileId } },
        { upsert: true, new: true }
      ).populate("profileId", "name age photo bio location interests");
      isMatch = true;
    }

    res.status(201).json({
      success: true,
      action,
      isMatch,
      match: isMatch ? {
        id: match.profileId._id,
        name: match.profileId.name,
        photo: match.profileId.photo
      } : null
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "This profile was already swiped on." });
    next(error);
  }
});

router.get("/matches", async (req, res, next) => {
  try {
    const matches = await Match.find({ userId: DEMO_USER_ID })
      .populate("profileId", "name age photo bio location interests")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      matches: matches.map(item => ({
        id: item.profileId._id,
        name: item.profileId.name,
        age: item.profileId.age,
        photo: item.profileId.photo,
        bio: item.profileId.bio,
        location: item.profileId.location,
        interests: item.profileId.interests,
        matchedAt: item.createdAt
      }))
    });
  } catch (error) { next(error); }
});

export default router;
