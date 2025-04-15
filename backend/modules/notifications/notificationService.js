import Notification from "./notificationModel.js";
import { v4 as uuidv4 } from "uuid";
import User from "../Users/userModel.js"; 

export async function sendNearbyEventNotifications(event) {
  const { location, eventType, _id: eventId } = event;

  const nearbySecurityUsers = await User.find({
    isOnline: true,
    multiRole: "security",
    location: {
      $nearSphere: {
        $geometry: location,
        $maxDistance: 3000 // 3km
      }
    }
  });

  const notifications = nearbySecurityUsers.map((user) => ({
    notificationId: uuidv4(),
    targetUserId: user._id,
    message: `Nearby alert: ${eventType}`,
    eventRef: eventId,
    sentAt: new Date(),
    readStatus: false
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
    console.log(`[NOTIFY] Sent to ${notifications.length} security users`);
  } else {
    console.log("[NOTIFY] No nearby users found");
  }
}
