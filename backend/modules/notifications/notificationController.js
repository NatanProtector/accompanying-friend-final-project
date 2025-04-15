const Notification = require("../notifications/notificationModel");

router.get("/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ targetUserId: userId }).sort({ sentAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    res.status(500).json({ message: "Error fetching notifications", err });
  }
});
