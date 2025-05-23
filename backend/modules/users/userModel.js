const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, unique: true },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  idPhoto: { type: String, required: false }, // Temporarily stored
  multiRole: { type: [String], required: true },
  isOnline: { type: Boolean, default: false },
  registrationStatus: { type: String, default: "pending" }, // Default status

  location: {
    type: { type: String, enum: ["Point"], default: "Point" }, // Required for GeoJSON
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isNew) {
    this.verificationToken = crypto.randomUUID();
  }

  next();
});

// Add a static method to validate conditional fields
userSchema.statics.validateFields = function (data) {
  if (data.multiRole.includes("security") && !data.securityCertificatePhoto) {
    throw new Error(
      "Security certificate photo is required for security role."
    );
  }
};

userSchema.index({ location: "2dsphere" });

// Check if model exists before creating it
const Users =
  mongoose.models.Users || mongoose.model("Users", userSchema, "Users");
module.exports = Users;
