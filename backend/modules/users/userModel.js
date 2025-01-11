const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  idPhoto: { type: String, required: false }, // Temporarily stored
  securityCertificatePhoto: { type: String, required: false }, // Optional, only for security
  password: { type: String, required: false }, // New field for hashed password - for now not required.TODO: Add validation
  multiRole: { type: [String], required: true }, // New field for roles
  registrationStatus: { type: String, default: 'pending' }, // Default status
  lastLogin: { type: Date },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Add a static method to validate conditional fields
userSchema.statics.validateFields = function (data) {
  if (data.multiRole.includes('security') && !data.securityCertificatePhoto) {
    throw new Error('Security certificate photo is required for security role.');
  }
};

const Users = mongoose.model('Users', userSchema, 'Users');
module.exports = Users;
