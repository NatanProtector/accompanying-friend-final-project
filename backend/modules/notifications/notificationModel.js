const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  message: { type: String, required: true },
  eventRef: { type: mongoose.Schema.Types.ObjectId, ref: "Events" },
  sentAt: { type: Date, default: Date.now },
  readStatus: { type: Boolean, default: false }
});

const Notification = mongoose.model("Notification", notificationSchema, "Notifications");
module.exports = Notification;
