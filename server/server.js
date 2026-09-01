const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Recommendation = require("./models/Recommendation");

const app = express();

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a user
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all recommendations
app.get("/recommendations", async (req, res) => {
  try {
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a recommendation
app.post("/recommendations", async (req, res) => {
  try {
    const recommendation = await Recommendation.create(req.body);
    res.status(201).json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});