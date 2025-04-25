const express = require("express");
const authRoutes = require("../modules/auth/authController");
const router = express.Router();
const eventController = require("../modules/events/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const notificationRoutes = require("../modules/notifications/notificationController");
const captchaRoutes = require("../modules/captcha/captchaController");

router.post("/events/report", authMiddleware, eventController.reportEvent);

// ✅ Public or protected? (you choose)
router.get("/events", eventController.getAllEvents); // or add authMiddleware if needed

router.get("/events/status/:status", eventController.getEventsByStatus);

router.put(
  "/events/:eventId/status",
  authMiddleware,
  eventController.updateEventStatus
);

router.use("/auth", authRoutes);
router.use("/auth", notificationRoutes);
router.use("/recaptcha", captchaRoutes);

module.exports = router;
