const { reportEventSchema } = require("./eventValidation");
const eventService = require("./eventService");
const Event = require("./eventModel");
const {
  sendNearbyEventNotifications,
} = require("../notifications/notificationService");
const { notifyAdminsAboutNewEvent } = require("../../sockets/sockets");

exports.reportEvent = async (req, res) => {
  try {
    const { error } = reportEventSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newEvent = await eventService.createEvent(req.body, userId);

    // ✅ Notify nearby security users (non-blocking optional)
    await sendNearbyEventNotifications(newEvent);

    // Notify admins about the new event
    notifyAdminsAboutNewEvent();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Event reporting failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateEventStatus = async (req, res) => {
  const { eventId } = req.params;
  const { newStatus } = req.body;

  if (!["pending", "ongoing", "finished"].includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

exports.getEventsByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const events = await Event.find({ status });
    res.status(200).json(events);
  } catch (err) {
    console.error(`[GET /events/status/${status}] Error:`, err);
    res.status(500).json({ message: "Failed to fetch events by status" });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ timestamp: -1 }); // newest first
    res.status(200).json(events);
  } catch (err) {
    console.error("[GET /events] Failed:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.getNearbyActiveEvents = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ message: "Missing lat/lng" });
  }

  try {
    const events = await Event.find({
      status: { $in: ["pending", "ongoing"] },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000 // 5km radius, adjust as needed
        }
      }
    });

    res.status(200).json(events);
  } catch (err) {
    console.error("Failed to get nearby events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

