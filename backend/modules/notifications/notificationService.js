const Notification = require("./notificationModel.js");
const { v4: uuidv4 } = require("uuid");
const User = require("../Users/userModel.js");
const { sendNotificationToUser } = require("../../sockets/sockets.js"); // <-- import!

async function sendNearbyEventNotifications(event) {
  const { location, eventType, _id: eventId } = event;

  const nearbySecurityUsers = await User.find({
    isOnline: true,
    multiRole: "security",
    location: {
      $nearSphere: {
        $geometry: location,
        $maxDistance: 3000, // 3km
      },
    },
  });

  const notifications = nearbySecurityUsers.map((user) => ({
    notificationId: uuidv4(),
    targetUserId: user._id,
    message: `Nearby alert: ${eventType}`,
    eventRef: eventId,
    sentAt: new Date(),
    readStatus: false,
  }));

  if (notifications.length > 0) {
    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`[NOTIFY] Sent to ${createdNotifications.length} security users`);

    // ✨ Emit in real-time ✨
    for (const notification of createdNotifications) {
      await notification.populate('eventRef'); // populate event data before sending
      sendNotificationToUser(notification.targetUserId, notification);
    }

  } else {
    console.log("[NOTIFY] No nearby users found");
  }
}

module.exports = { sendNearbyEventNotifications };
