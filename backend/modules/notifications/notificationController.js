const express = require("express");
const router = express.Router();
const Notification = require("../notifications/notificationModel");

// Get all notifications for a user
router.get("/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const allNotifications = await Notification.find({ targetUserId: userId })
      .populate("eventRef")
      .sort({ sentAt: -1 });

    // Filter: only notifications for ongoing events
    const filtered = allNotifications.filter(
      (n) => n.eventRef && n.eventRef.status === "ongoing"
    );

    res.json(filtered);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    res.status(500).json({ message: "Error fetching notifications", err });
  }
});


// Get unread count
router.get("/notifications/unread/:userId", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      targetUserId: req.params.userId,
      readStatus: false,
    });
    res.json({ unreadCount: count });
  } catch (err) {
    console.error("Unread check failed:", err);
    res.status(500).json({ message: "Error checking unread notifications" });
  }
});

// Mark notifications as read
router.patch("/notifications/mark-read/:userId", async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { targetUserId: req.params.userId, readStatus: false },
      { $set: { readStatus: true } }
    );
    res.json({ message: "Marked as read", updated: result.modifiedCount });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
});

module.exports = router;
