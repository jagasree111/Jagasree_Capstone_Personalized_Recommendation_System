const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const authenticateToken = require("./Middleware/authMiddleware");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());

const User = require("./models/User");
const Recommendation = require("./models/Recommendation");
const UploadedResource = require("./models/UploadedResource");

const JWT_SECRET = process.env.JWT_SECRET || "development-only-jwt-secret";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/personalized_recommendation_system";
const uploadsDirectory = path.join(__dirname, "uploads");

fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error("Only PDF, DOC, DOCX, PNG, and JPG files are supported"));
  },
});

app.use("/uploads", express.static(uploadsDirectory));

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

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

// Upload and manage resources owned by the authenticated user
app.get("/uploads", authenticateToken, async (req, res) => {
  try {
    const resources = await UploadedResource.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(resources.map((resource) => ({
      ...resource,
      url: `/uploads/${resource.storedName}`,
    })));
  } catch (error) {
    res.status(500).json({ message: "Failed to load resources", error: error.message });
  }
});

app.post("/uploads", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "A file is required" });
    }

    if (!req.body.title || !req.body.title.trim()) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "A resource title is required" });
    }

    const resource = await UploadedResource.create({
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      user: req.user.userId,
    });

    res.status(201).json({
      message: "Resource uploaded successfully",
      resource: { ...resource.toObject(), url: `/uploads/${resource.storedName}` },
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(400).json({ message: "Upload failed", error: error.message });
  }
});

app.delete("/uploads/:id", authenticateToken, async (req, res) => {
  try {
    const resource = await UploadedResource.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const filePath = path.join(uploadsDirectory, resource.storedName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete resource", error: error.message });
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
const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});