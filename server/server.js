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

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a user
app.post("/users", async (req, res) => {
  try {
    const { name, email, interests } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const user = await User.create({
      name,
      email,
      interests
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user",
      error: error.message
    });
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

    res.status(201).json({
      message: "Recommendation created successfully",
      recommendation
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create recommendation",
      error: error.message
    });
  }
});

// Get recommendation by ID
app.get("/recommendations/:id", async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});