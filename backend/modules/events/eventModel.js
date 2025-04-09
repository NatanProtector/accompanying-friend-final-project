const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  status: { type: String, default: "pending" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  relatedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  voiceCommands: { type: String },
  instructions: { type: String },
});

eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", eventSchema, "Events");
module.exports = Event;

