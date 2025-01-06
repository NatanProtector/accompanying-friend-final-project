const express = require('express');
const { registrationSchema } = require('./authValidation');
const router = express.Router();
const User = require('../Users/userModel');


router.post('/register', async (req, res) => {
  console.log('Incoming Request Body:', req.body); // Add this
  const { firstName, lastName, phone, idNumber, email, idPhoto } = req.body;

  const { error } = registrationSchema.validate(req.body);
  if (error) {
    console.log('Validation Error:', error.details); // Log validation errors
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
      idPhoto,
      registrationStatus: 'pending',
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful', userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving the user' });
  }
});

module.exports = router;
