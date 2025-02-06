require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const User = require("./schema"); // Import User model

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express server is running");
});

// POST API Endpoint to handle user data
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.validate(); // Validate data
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ message: "Validation error", error: error.message });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Testing the Backend
console.log("Starting server...");
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection successful");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});