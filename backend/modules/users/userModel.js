const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  idPhoto: { type: String, required: false }, // Temporarily stored
  registrationStatus: { type: String, default: 'pending' }, // Default status
});

module.exports = mongoose.model('Users', userSchema);
