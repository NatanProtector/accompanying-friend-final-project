const express = require('express');
const { registrationSchema } = require('./authValidation');
const router = express.Router();
const User = require('../Users/userModel');
const authService = require('./authService');
const authValidation = require('./authValidation'); 

router.post('/register', async (req, res) => {
  console.log('Incoming Request Body:', req.body); 
  const { firstName, lastName, phone, idNumber, email, idPhoto, multiRole, securityCertificatePhoto } = req.body;

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

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { error } = authValidation.validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Call the login service
    const result = await authService.login(req.body.email, req.body.password, req.body.role);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

module.exports = router;
