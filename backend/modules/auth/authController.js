const express = require("express");
const { registrationSchema } = require("./authValidation");
const router = express.Router();

const User = require('../Users/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require("path");
const crypto = require("crypto");

router.post("/register", async (req, res) => {
  console.log("Incoming Request Body:", req.body);
  const {
    firstName,
    lastName,
    phone,
    password,
    idNumber,
    email,
    idPhoto,
    multiRole,
    securityCertificatePhoto,
  } = req.body;

  const { error } = registrationSchema.validate(req.body);
  if (error) {
    console.log("Validation Error:", error.details);

    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const fullName = `${firstName} ${lastName}`;
    const newUser = new User({
      firstName,
      lastName,
      fullName,
      phone,
      idNumber,
      email,
      password,
      idPhoto,
      multiRole,
      securityCertificatePhoto,
      registrationStatus: "pending",
    });

    await newUser.save();
    res.status(201).json({
      message: "Registration successful",
      userId: newUser._id,
      verificationToken: newUser.verificationToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while saving the user" });
  }
});

// Update user registration status
router.put("/update-status", async (req, res) => {
  const { idNumbers, newStatus } = req.body;

  if (
    !Array.isArray(idNumbers) ||
    idNumbers.length === 0 ||
    !["pending", "approved", "denied"].includes(newStatus)
  ) {
    return res.status(400).json({
      message:
        "Invalid request body. 'idNumbers' must be a non-empty array and 'newStatus' must be 'pending', 'approved', or 'denied'.",
    });
  }

  try {
    const result = await User.updateMany(
      { idNumber: { $in: idNumbers } },
      { registrationStatus: newStatus }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the provided ID numbers." });
    }

    res.status(200).json({
      message: `Successfully updated status to '${newStatus}' for ${result.modifiedCount} user(s).`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating user statuses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { idNumber, password } = req.body;

  try {
    const user = await User.findOne({ idNumber });

    if (!user) {
      return res.status(401).json({ message: "ID number is incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    user.isOnline = true;
    await user.save();


    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect." });
    }

    if (user.emailVerified === false) {
      return res.status(403).json({ message: "Email not verified." });
    }

    if (user.registrationStatus !== "approved") {
      return res
        .status(403)
        .json({ message: "Your registration is still pending approval." });
    }

    // ✅ Create the JWT token
    const payload = {
      _id: user._id,
      idNumber: user.idNumber,
      email: user.email,
      multiRole: user.multiRole,
      registrationStatus: user.registrationStatus,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        idNumber: user.idNumber,
        multiRole: user.multiRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error });
  }
});

router.post("/logout", async (req, res) => {
  const { idNumber } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { idNumber },
      { isOnline: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout", error });
  }
});

// Get all users with registrationStatus 'pending'
router.get("/pending-users", async (req, res) => {
  try {
    const pendingUsers = await User.find({
      registrationStatus: "pending",
      emailVerified: true,
    });
    res.json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Failed to fetch pending users", error });
  }
});

// Get approved users
router.get("/approved-users", async (req, res) => {
  try {
    const users = await User.find({ registrationStatus: "approved" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch approved users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get denied users
router.get("/denied-users", async (req, res) => {
  try {
    const users = await User.find({ registrationStatus: "denied" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch denied users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch user by email to get idNumber and _id
router.get("/get-user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Fetch user by _id (MongoDB ObjectId)
router.get("/get-user-by-id/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Fetch user by idNumber
router.get("/get-user-by-idNumber/:idNumber", async (req, res) => {
  const { idNumber } = req.params;

  try {
    const user = await User.findOne({ idNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Healthcheck route to check if the server is running
router.get("/healthcheck", async (req, res) => {
  try {
    res.json({ message: "Server is running" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// Update user location using idNumber
router.put("/update-location/:idNumber", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({ message: "Latitude and longitude are required." });

  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { idNumber: req.params.idNumber },
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Location update failed:", err);
    res.status(500).json({ message: "Failed to update location" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/verify/:verificationToken", async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.emailVerified = true;
    await user.save();

    // Return page notifying the user of successful verification
    res
      .status(200)
      .sendFile(path.join(__dirname, "../../public/verification.html"));
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const hour = 3600000; // 1 hour in milliseconds

// Account Recovery Route
router.post("/recover-account", async (req, res) => {
  const { idNumber, phone, email } = req.body;
  console.log("Received request body:", req.body);

  // Basic validation for incoming data
  if (!idNumber || !phone || !email) {
    return res
      .status(400)
      .json({ message: "Missing required fields: idNumber, phone, email." });
  }

  try {
    const user = await User.findOne({ idNumber, phone, email });

    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Email not verified." });
    }

    if (user.registrationStatus !== "approved") {
      return res
        .status(403)
        .json({ message: "Account registration not approved." });
    }

    // Check if a password reset is already in progress
    if (
      user.passwordResetToken &&
      user.passwordResetExpires &&
      user.passwordResetExpires > Date.now()
    ) {
      return res.status(403).json({
        message: "Password recovery process already initiated.",
      });
    }

    // Generate the password reset token
    user.passwordResetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetExpires = Date.now() + hour;

    await user.save();

    // Respond with success and the unhashed token
    res.status(200).json({
      message: "Account verified successfully.",
      passwordResetToken: user.passwordResetToken,
      name: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error("Account recovery error:", error);
    res
      .status(500)
      .json({ message: "Server error during account recovery", error });
  }
});

// GET route to serve the reset password page
router.get("/reset-password/:resetToken", async (req, res) => {
  const { resetToken } = req.params;

  try {
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    // Serve the reset password page
    res.sendFile(path.join(__dirname, "../../public/reset-password.html"));
  } catch (error) {
    console.error("Error serving reset password page:", error);
    res.status(500).send("Internal server error");
  }
});

// POST route to handle the password reset form submission
router.post("/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res
      .status(400)
      .json({ message: "Reset token and new password are required." });
  }

  // Basic password validation (can be expanded based on requirements)
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }
  // Add more validation rules here if needed (uppercase, lowercase, number, special char)

  try {
    // Find the user by the reset token and check expiry
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      // If no user is found, the token is invalid or expired
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    // Update the password and clear the reset token fields
    user.password = newPassword; // The pre-save hook in userModel will hash it
    user.passwordResetToken = undefined; // Clear the token
    user.passwordResetExpires = undefined; // Clear the expiry date

    await user.save(); // Save the updated user document

    console.log(`Password changed successfully`);
    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error during password reset:", error);
    // Check if the error is due to validation (e.g., from pre-save hook if you add more validation)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Password validation failed.",
        details: error.errors,
      });
    }
    res
      .status(500)
      .json({ message: "Internal server error during password reset." });
  }
});

module.exports = router;
