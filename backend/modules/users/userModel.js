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
  location: {
    type: { type: String, enum: ["Point"], default: "Point" }, // Required for GeoJSON
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
});

const Users = mongoose.model('Users', userSchema, 'Users');
module.exports = Users;