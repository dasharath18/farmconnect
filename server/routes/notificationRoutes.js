const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const { getNotifications, deleteNotification } = require("../controllers/notificationController");

// GET /api/notifications
router.get("/", authenticate, getNotifications);

// DELETE /api/notifications/:id
router.delete("/:id", authenticate, deleteNotification);

module.exports = router;
