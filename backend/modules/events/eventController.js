const { reportEventSchema } = require("./eventValidation");
const eventService = require("./eventService");
const Event = require("./eventModel");


exports.reportEvent = async (req, res) => {
  try {
    const { error } = reportEventSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newEvent = await eventService.createEvent(req.body, userId);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Event reporting failed:", err);
    res.status(500).json({ message: "Internal server error" });
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