const express = require('express');
const { registrationSchema } = require('./authValidation');
const router = express.Router();
const User = require('../Users/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  console.log('Incoming Request Body:', req.body);
  const { firstName, lastName, phone, password, idNumber, email, idPhoto, multiRole, securityCertificatePhoto } = req.body;

  const { error } = registrationSchema.validate(req.body);
  if (error) {
    console.log('Validation Error:', error.details);
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
      registrationStatus: 'pending',
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful', userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving the user' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { idNumber, password } = req.body;

  try {
    const user = await User.findOne({ idNumber });

    if (!user) {
      return res.status(401).json({ message: 'ID number is incorrect.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    user.isOnline = true;
    await user.save();


    if (!isMatch) {
      return res.status(401).json({ message: 'Password is incorrect.' });
    }

    if (user.registrationStatus !== 'approved') {
      return res.status(403).json({ message: 'Your registration is still pending approval.' });
    }

    // ✅ Create the JWT token
    const payload = {
      _id: user._id,
      idNumber: user.idNumber,
      email: user.email,
      multiRole: user.multiRole,
      registrationStatus: user.registrationStatus
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        idNumber: user.idNumber,
        multiRole: user.multiRole
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login', error });
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
router.get('/pending-users', async (req, res) => {
  try {
    const pendingUsers = await User.find({ registrationStatus: 'pending' });
    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ message: 'Failed to fetch pending users', error });
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


module.exports = router;
