const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  message: { type: String, required: true },
  eventRef: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  sentAt: { type: Date, default: Date.now, index: { expires: 43200 } }, // 12 hours expiration
  readStatus: { type: Boolean, default: false }
});

const Notification = mongoose.model("Notification", notificationSchema, "Notifications");
module.exports = Notification;
