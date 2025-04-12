const express = require('express');
const authRoutes = require('../modules/auth/authController');
const router = express.Router();
const eventController = require("../modules/events/eventController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/events/report", authMiddleware, eventController.reportEvent);

// ✅ Public or protected? (you choose)
router.get("/events", eventController.getAllEvents); // or add authMiddleware if needed

router.get("/events/status/:status", eventController.getEventsByStatus);


router.use('/auth', authRoutes);

module.exports = router;
