const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = require("./Middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

const User = require("./models/User");
const Recommendation = require("./models/Recommendation");

const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

  // Register user
app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// Login user
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("recommendations");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
  .populate("recommendations");

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

// Update a user
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email, interests, recommendations } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
       name,
       email,
       interests,
       recommendations
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update user",
      error: error.message
    });
  }
});

// Get all recommendations
app.get("/recommendations", authenticateToken, async (req, res) => {
  try {
    const recommendations = await Recommendation.find()
  .populate("user");
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a recommendation
app.post("/recommendations", authenticateToken, async (req, res) => {
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
app.get("/recommendations/:id", authenticateToken, async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id)
  .populate("user");

    if (!recommendation) {
      return res.status(404).json({
        message: "Recommendation not found"
      });
    }

    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/recommendations/:id", authenticateToken, async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndDelete(
      req.params.id
    );

    if (!recommendation) {
      return res.status(404).json({
        message: "Recommendation not found"
      });
    }

    res.status(200).json({
      message: "Recommendation deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete recommendation",
      error: error.message
    });
  }
});

// Update a recommendation
app.put("/recommendations/:id", authenticateToken, async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!recommendation) {
      return res.status(404).json({
        message: "Recommendation not found"
      });
    }

    res.status(200).json({
      message: "Recommendation updated successfully",
      recommendation
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update recommendation",
      error: error.message
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});