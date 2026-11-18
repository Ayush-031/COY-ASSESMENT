import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import discoveryRoutes from "./routes/discovery.js";
import Profile from "./models/Profile.js";
import { seedProfiles } from "./data/seedProfiles.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/", discoveryRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Profile.countDocuments();
    if (count === 0) {
      await Profile.insertMany(seedProfiles);
      console.log(`Seeded ${seedProfiles.length} mock profiles.`);
    }
    app.listen(PORT, () => console.log(`Coy Discover API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Startup failed. Check MongoDB and MONGODB_URI.", error);
    process.exit(1);
  }
};

start();
